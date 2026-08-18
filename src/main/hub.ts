import { EventEmitter } from 'events';
import crypto from 'crypto';
import path from 'path';
import os from 'os';
import type {
  AppConfig,
  DashboardData,
  DataChannel,
  PrintersData,
  TodoData,
  TodoItem,
} from '../shared/types';
import { Store } from './store';
import { UsageParser } from './parser';
import { ClaudeWatcher } from './watcher';
import { NetworkMonitor } from './services/network';
import { fetchWeather } from './services/weather';
import { GoogleAuth } from './services/google/auth';
import { fetchMail } from './services/google/gmail';
import { fetchCalendar } from './services/google/calendar';
import { buildClaudeData } from './services/claude';
import { BambuService } from './services/printers/bambu';
import { fetchElegooStatuses } from './services/printers/elegoo';

const INTERVALS: Record<Exclude<DataChannel, 'network' | 'todos'>, number> = {
  weather: 10 * 60_000,
  mail: 2 * 60_000,
  calendar: 5 * 60_000,
  claude: 60_000,
  printers: 20_000,
};

/**
 * Owns every data source: polls each one on its own cadence, keeps the last good
 * payload, and emits `data` whenever a channel changes so the window can push it
 * to the renderer.
 */
export class Hub extends EventEmitter {
  readonly store: Store;
  readonly auth: GoogleAuth;
  readonly network: NetworkMonitor;
  readonly parser = new UsageParser();

  private watcher: ClaudeWatcher | null = null;
  private bambu = new BambuService();
  private timers: NodeJS.Timeout[] = [];
  private data: DashboardData;
  private errors = new Map<DataChannel, string>();
  private inFlight = new Set<DataChannel>();

  constructor(store = new Store()) {
    super();
    this.store = store;
    this.auth = new GoogleAuth(store);
    this.network = new NetworkMonitor(store.getConfig().network);
    this.data = {
      weather: null,
      network: null,
      mail: null,
      calendar: null,
      claude: null,
      printers: null,
      todos: { items: store.getTodos(), updatedAt: Date.now() },
    };
  }

  start(): void {
    this.startClaudeWatcher();

    this.network.on('sample', (payload) => {
      this.data.network = payload;
      this.emit('data', 'network', payload);
    });
    this.network.start();

    this.bambu.on('update', () => void this.refresh('printers'));
    this.syncPrinters();

    for (const [channel, interval] of Object.entries(INTERVALS)) {
      const key = channel as DataChannel;
      void this.refresh(key);
      const timer = setInterval(() => void this.refresh(key), interval);
      this.timers.push(timer);
    }
  }

  stop(): void {
    for (const timer of this.timers) clearInterval(timer);
    this.timers = [];
    this.network.stop();
    this.watcher?.stop();
    this.bambu.dispose();
  }

  private startClaudeWatcher(): void {
    const claudeDir = path.join(os.homedir(), '.claude');
    this.watcher = new ClaudeWatcher(claudeDir, this.parser);
    // The transcripts change constantly; recompute the panel rather than the raw feed.
    this.watcher.on('usage-update', () => void this.refresh('claude'));
    this.watcher.start();
  }

  getAll(): DashboardData {
    return this.data;
  }

  getErrors(): Record<string, string> {
    return Object.fromEntries(this.errors);
  }

  /** Re-reads one channel. Overlapping calls collapse into the one in flight. */
  async refresh(channel: DataChannel): Promise<void> {
    if (channel === 'network' || channel === 'todos') {
      this.emit('data', channel, channel === 'todos' ? this.data.todos : this.data.network);
      return;
    }
    if (this.inFlight.has(channel)) return;
    this.inFlight.add(channel);

    const config = this.store.getConfig();
    try {
      switch (channel) {
        case 'weather':
          this.data.weather = await fetchWeather(config.weather);
          break;
        case 'mail':
          this.data.mail = await fetchMail(this.auth, config.google.accounts);
          break;
        case 'calendar':
          this.data.calendar = await fetchCalendar(this.auth, config.google.accounts);
          break;
        case 'claude':
          this.data.claude = await buildClaudeData(this.parser, this.store);
          break;
        case 'printers':
          this.data.printers = await this.collectPrinters(config);
          break;
      }
      this.errors.delete(channel);
      this.emit('data', channel, this.data[channel]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.errors.set(channel, message);
      this.emit('error', { channel, message, at: Date.now() });
    } finally {
      this.inFlight.delete(channel);
    }
  }

  async refreshAll(): Promise<void> {
    await Promise.all(
      (['weather', 'mail', 'calendar', 'claude', 'printers'] as DataChannel[]).map((channel) =>
        this.refresh(channel)
      )
    );
  }

  private async collectPrinters(config: AppConfig): Promise<PrintersData> {
    const elegoo = await fetchElegooStatuses(config.printers.elegoo);
    return {
      printers: [...this.bambu.getStatuses(), ...elegoo],
      updatedAt: Date.now(),
    };
  }

  private syncPrinters(): void {
    const config = this.store.getConfig();
    this.bambu.sync(config.printers.bambu, (id) =>
      this.store.getKeyedSecret('bambuAccessCodes', id)
    );
  }

  /* ------------------------------------------------------------- config */

  updateConfig(patch: Partial<AppConfig>): AppConfig {
    const before = this.store.getConfig();
    const config = this.store.updateConfig(patch);

    if (patch.network) this.network.setConfig(config.network);
    if (patch.printers) this.syncPrinters();

    if (patch.weather) void this.refresh('weather');
    if (patch.google) {
      void this.refresh('mail');
      void this.refresh('calendar');
    }
    if (patch.claude) void this.refresh('claude');
    if (patch.printers) void this.refresh('printers');
    if (before.general.alwaysOnTop !== config.general.alwaysOnTop) {
      this.emit('always-on-top', config.general.alwaysOnTop);
    }
    this.emit('config', config);
    return config;
  }

  /** Drops a Bambu connection so the next sync picks up a new access code. */
  reconnectPrinter(id: string): void {
    this.bambu.reconnect(id);
    this.syncPrinters();
    void this.refresh('printers');
  }

  /* -------------------------------------------------------------- todos */

  private publishTodos(items: TodoItem[]): TodoData {
    const saved = this.store.setTodos(items);
    this.data.todos = { items: saved, updatedAt: Date.now() };
    this.emit('data', 'todos', this.data.todos);
    return this.data.todos;
  }

  addTodo(input: Partial<TodoItem> & { title: string }): TodoData {
    const items = this.store.getTodos();
    const item: TodoItem = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      notes: input.notes ?? '',
      done: false,
      priority: input.priority ?? 'normal',
      dueAt: input.dueAt ?? null,
      createdAt: Date.now(),
      completedAt: null,
      order: items.length,
    };
    return this.publishTodos([...items, item]);
  }

  updateTodo(id: string, patch: Partial<TodoItem>): TodoData {
    const items = this.store.getTodos().map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch, id: item.id };
      if (patch.done !== undefined) {
        next.completedAt = patch.done ? Date.now() : null;
      }
      return next;
    });
    return this.publishTodos(items);
  }

  removeTodo(id: string): TodoData {
    return this.publishTodos(this.store.getTodos().filter((item) => item.id !== id));
  }

  clearCompletedTodos(): TodoData {
    return this.publishTodos(this.store.getTodos().filter((item) => !item.done));
  }

  reorderTodos(orderedIds: string[]): TodoData {
    const byId = new Map(this.store.getTodos().map((item) => [item.id, item]));
    const ordered = orderedIds
      .map((id, index) => {
        const item = byId.get(id);
        if (!item) return null;
        byId.delete(id);
        return { ...item, order: index };
      })
      .filter((item): item is TodoItem => item !== null);
    return this.publishTodos([...ordered, ...byId.values()]);
  }
}
