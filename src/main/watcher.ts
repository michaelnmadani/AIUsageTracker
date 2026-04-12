import { EventEmitter } from 'events';
import chokidar from 'chokidar';
import fs from 'fs';
import { UsageParser } from './parser';
import { detectClaudeDataSources, buildWatchTargets } from './paths';

export class ClaudeWatcher extends EventEmitter {
  private parser: UsageParser;
  private watcher: chokidar.FSWatcher | null = null;
  private fileSizes: Map<string, number> = new Map();
  private activityTimeout: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private apiPollInterval: NodeJS.Timeout | null = null;

  constructor(parser: UsageParser) {
    super();
    this.parser = parser;
  }

  start(): void {
    // Initial parse of all existing data
    this.parser.parseAll();

    // Build watch targets from all detected sources
    const sources = detectClaudeDataSources();
    const targets = buildWatchTargets(sources);

    const allPatterns: string[] = [];
    for (const target of targets) {
      console.log(`[Watcher] ${target.label}:`);
      for (const p of target.patterns) {
        console.log(`  -> ${p}`);
        allPatterns.push(p);
      }
    }

    if (allPatterns.length === 0) {
      console.warn('[Watcher] No watch targets found! No Claude data directories detected.');
      // Still emit initial state
      this.emitFullUpdate();
      return;
    }

    console.log('[Watcher] Watching', allPatterns.length, 'patterns');

    this.watcher = chokidar.watch(allPatterns, {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher.on('add', (filePath) => this.handleFileChange(filePath));
    this.watcher.on('change', (filePath) => this.handleFileChange(filePath));

    // Emit initial state
    this.emitFullUpdate();
  }

  /** Start periodic API polling (if API client is configured) */
  startApiPolling(intervalMinutes: number): void {
    this.stopApiPolling();

    // Do an initial sync
    this.syncApi();

    // Then poll at the configured interval
    this.apiPollInterval = setInterval(() => {
      this.syncApi();
    }, intervalMinutes * 60 * 1000);

    console.log('[Watcher] API polling started, interval:', intervalMinutes, 'minutes');
  }

  stopApiPolling(): void {
    if (this.apiPollInterval) {
      clearInterval(this.apiPollInterval);
      this.apiPollInterval = null;
    }
  }

  private async syncApi(): Promise<void> {
    const result = await this.parser.syncFromApi();
    if (result.fetched > 0) {
      this.emitFullUpdate();
    }
  }

  stop(): void {
    this.watcher?.close();
    this.stopApiPolling();
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
  }

  private handleFileChange(filePath: string): void {
    if (filePath.endsWith('.jsonl')) {
      this.handleJsonlChange(filePath);
    } else if (filePath.endsWith('.json') && filePath.includes('sessions')) {
      // Re-parse sessions
      this.parser.parseAll();
    }

    this.setActive(true);
  }

  private handleJsonlChange(filePath: string): void {
    try {
      const stat = fs.statSync(filePath);
      const previousSize = this.fileSizes.get(filePath) || 0;

      if (stat.size > previousSize) {
        const fd = fs.openSync(filePath, 'r');
        const buffer = Buffer.alloc(stat.size - previousSize);
        fs.readSync(fd, buffer, 0, buffer.length, previousSize);
        fs.closeSync(fd);

        const newContent = buffer.toString('utf-8');
        const newEntries = this.parser.parseNewLines(filePath, newContent);

        if (newEntries.length > 0) {
          this.emit('usage-update', {
            current: this.parser.getCurrentSession(),
            history: this.parser.getHistoricalUsage(),
            projects: this.parser.getProjects(),
            models: this.parser.getModelBreakdown(),
            newEntries,
          });
        }
      }

      this.fileSizes.set(filePath, stat.size);
    } catch {
      // File may have been deleted or moved
    }
  }

  private emitFullUpdate(): void {
    this.emit('usage-update', {
      current: this.parser.getCurrentSession(),
      history: this.parser.getHistoricalUsage(),
      projects: this.parser.getProjects(),
      models: this.parser.getModelBreakdown(),
    });
  }

  private setActive(active: boolean): void {
    if (active !== this.isActive) {
      this.isActive = active;
      this.emit('status-change', { isActive: active });
    }

    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }

    if (active) {
      this.activityTimeout = setTimeout(() => {
        this.setActive(false);
      }, 30000);
    }
  }
}
