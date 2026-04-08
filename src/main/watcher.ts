import { EventEmitter } from 'events';
import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { UsageParser } from './parser';

export class ClaudeWatcher extends EventEmitter {
  private claudeDir: string;
  private parser: UsageParser;
  private watcher: chokidar.FSWatcher | null = null;
  private fileSizes: Map<string, number> = new Map();
  private activityTimeout: NodeJS.Timeout | null = null;
  private isActive: boolean = false;

  constructor(claudeDir: string, parser: UsageParser) {
    super();
    this.claudeDir = claudeDir;
    this.parser = parser;
  }

  start(): void {
    // Initial parse of all existing data
    this.parser.parseAll();

    const projectsDir = path.join(this.claudeDir, 'projects');
    const sessionsDir = path.join(this.claudeDir, 'sessions');

    const watchPaths = [
      `${projectsDir}/**/*.jsonl`,
      `${sessionsDir}/*.json`,
    ];

    this.watcher = chokidar.watch(watchPaths, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    this.watcher.on('add', (filePath) => this.handleFileChange(filePath));
    this.watcher.on('change', (filePath) => this.handleFileChange(filePath));

    // Emit initial state
    this.emit('usage-update', {
      current: this.parser.getCurrentSession(),
      history: this.parser.getHistoricalUsage(),
      projects: this.parser.getProjects(),
      models: this.parser.getModelBreakdown(),
    });
  }

  stop(): void {
    this.watcher?.close();
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

    // Update activity status
    this.setActive(true);
  }

  private handleJsonlChange(filePath: string): void {
    try {
      const stat = fs.statSync(filePath);
      const previousSize = this.fileSizes.get(filePath) || 0;

      if (stat.size > previousSize) {
        // Read only new content
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

  private setActive(active: boolean): void {
    if (active !== this.isActive) {
      this.isActive = active;
      this.emit('status-change', { isActive: active });
    }

    // Reset inactivity timer
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }

    if (active) {
      this.activityTimeout = setTimeout(() => {
        this.setActive(false);
      }, 30000); // 30 seconds of no activity = idle
    }
  }
}
