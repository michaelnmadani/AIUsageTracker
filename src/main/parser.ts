import fs from 'fs';
import path from 'path';
import os from 'os';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
}

export interface SessionData {
  sessionId: string;
  pid: number;
  cwd: string;
  startedAt: number;
  kind: string;
  projectName: string;
}

export interface UsageEntry {
  timestamp: string;
  model: string;
  usage: TokenUsage;
  type: string;
  sessionId?: string;
  projectName?: string;
}

export interface ProjectStats {
  name: string;
  path: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  sessionCount: number;
  lastActive: string;
  entries: UsageEntry[];
}

export interface ModelStats {
  model: string;
  displayName: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  entryCount: number;
  color: string;
}

export interface CurrentSessionInfo {
  isActive: boolean;
  sessionId: string | null;
  projectName: string | null;
  model: string | null;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheTokens: number;
  tokensPerMinute: number;
  startedAt: number | null;
  recentEntries: UsageEntry[];
}

const MODEL_DISPLAY: Record<string, { name: string; color: string }> = {
  'claude-opus-4-6': { name: 'Opus 4.6', color: '#9333ea' },
  'claude-sonnet-4-6': { name: 'Sonnet 4.6', color: '#3b82f6' },
  'claude-haiku-4-5-20251001': { name: 'Haiku 4.5', color: '#22c55e' },
};

function getModelDisplay(model: string): { name: string; color: string } {
  if (MODEL_DISPLAY[model]) return MODEL_DISPLAY[model];
  if (model.includes('opus')) return { name: model, color: '#9333ea' };
  if (model.includes('sonnet')) return { name: model, color: '#3b82f6' };
  if (model.includes('haiku')) return { name: model, color: '#22c55e' };
  return { name: model, color: '#6b7280' };
}

function decodeProjectPath(encoded: string): string {
  // Encoded path: -Users-john-Projects-MyApp or -home-user-MyProject
  // We want the last meaningful path segment as the project name
  // Replace the encoded path separator back to real path, then take basename
  const decoded = encoded.replace(/^-/, '/').replace(/-/g, '/');
  const basename = decoded.split('/').filter(Boolean).pop();
  return basename || encoded;
}

export class UsageParser {
  private claudeDir: string;
  private allEntries: UsageEntry[] = [];
  private sessions: Map<string, SessionData> = new Map();
  private lastParseTime: number = 0;

  constructor() {
    this.claudeDir = path.join(os.homedir(), '.claude');
  }

  parseAll(): void {
    console.log('[Parser] Parsing all data from:', this.claudeDir);
    this.parseSessions();
    console.log('[Parser] Found', this.sessions.size, 'sessions');
    this.parseTranscripts();
    this.parseRootHistory();
    console.log('[Parser] Found', this.allEntries.length, 'total usage entries');
    this.lastParseTime = Date.now();
  }

  private parseRootHistory(): void {
    // Some Claude versions store history.jsonl at the root level
    const historyFile = path.join(this.claudeDir, 'history.jsonl');
    if (fs.existsSync(historyFile)) {
      console.log('[Parser] Found root history.jsonl');
      this.parseJsonlFiles(this.claudeDir, 'history');
    }
  }

  private parseSessions(): void {
    const sessionsDir = path.join(this.claudeDir, 'sessions');
    if (!fs.existsSync(sessionsDir)) return;

    const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(sessionsDir, file), 'utf-8');
        const data = JSON.parse(content);
        if (data.sessionId) {
          this.sessions.set(data.sessionId, {
            sessionId: data.sessionId,
            pid: data.pid,
            cwd: data.cwd,
            startedAt: data.startedAt,
            kind: data.kind || 'unknown',
            projectName: path.basename(data.cwd || ''),
          });
        }
      } catch {
        // skip malformed session files
      }
    }
  }

  private parseTranscripts(): void {
    const projectsDir = path.join(this.claudeDir, 'projects');
    if (!fs.existsSync(projectsDir)) return;

    this.allEntries = [];

    const projectDirs = fs.readdirSync(projectsDir);
    for (const projectDir of projectDirs) {
      if (projectDir.startsWith('.')) continue;

      const projectPath = path.join(projectsDir, projectDir);
      const stat = fs.statSync(projectPath);
      if (!stat.isDirectory()) continue;

      const projectName = decodeProjectPath(projectDir);

      // Find JSONL files directly in project dir and in session subdirs
      this.parseJsonlFiles(projectPath, projectName);

      // Check session subdirectories
      const subdirs = fs.readdirSync(projectPath);
      for (const subdir of subdirs) {
        const subdirPath = path.join(projectPath, subdir);
        try {
          const subdirStat = fs.statSync(subdirPath);
          if (subdirStat.isDirectory()) {
            this.parseJsonlFiles(subdirPath, projectName);
            // Check subagents directory
            const subagentsDir = path.join(subdirPath, 'subagents');
            if (fs.existsSync(subagentsDir)) {
              this.parseJsonlFiles(subagentsDir, projectName);
            }
          }
        } catch {
          // skip inaccessible dirs
        }
      }
    }

    // Sort by timestamp
    this.allEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private parseJsonlFiles(dir: string, projectName: string): void {
    try {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
      console.log('[Parser] Scanning dir:', dir, '- found', files.length, 'JSONL files');
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n').filter((line) => line.trim());
          let usageCount = 0;
          let totalLines = lines.length;

          for (const line of lines) {
            try {
              const entry = JSON.parse(line);

              // Handle entries with message.usage (standard Claude Code CLI format)
              if (entry.message?.usage) {
                const usage = entry.message.usage;
                this.allEntries.push({
                  timestamp: entry.timestamp || new Date().toISOString(),
                  model: entry.message.model || 'unknown',
                  usage: {
                    inputTokens: usage.input_tokens || 0,
                    outputTokens: usage.output_tokens || 0,
                    cacheCreationTokens: usage.cache_creation_input_tokens || 0,
                    cacheReadTokens: usage.cache_read_input_tokens || 0,
                  },
                  type: entry.type || 'unknown',
                  sessionId: entry.sessionId,
                  projectName,
                });
                usageCount++;
              }

              // Also handle entries that have usage at top level (some formats)
              if (entry.usage && !entry.message?.usage) {
                const usage = entry.usage;
                this.allEntries.push({
                  timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString(),
                  model: entry.model || 'unknown',
                  usage: {
                    inputTokens: usage.input_tokens || usage.inputTokens || 0,
                    outputTokens: usage.output_tokens || usage.outputTokens || 0,
                    cacheCreationTokens: usage.cache_creation_input_tokens || 0,
                    cacheReadTokens: usage.cache_read_input_tokens || 0,
                  },
                  type: entry.type || 'unknown',
                  sessionId: entry.sessionId,
                  projectName,
                });
                usageCount++;
              }
            } catch {
              // skip malformed lines
            }
          }
          console.log('[Parser] File:', file, '-', totalLines, 'lines,', usageCount, 'with usage data');
        } catch {
          // skip unreadable files
        }
      }
    } catch {
      // skip inaccessible directories
    }
  }

  parseNewLines(filePath: string, newContent: string): UsageEntry[] {
    const projectName = this.getProjectNameFromPath(filePath);
    const newEntries: UsageEntry[] = [];
    const lines = newContent.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.message?.usage) {
          const usage = entry.message.usage;
          const usageEntry: UsageEntry = {
            timestamp: entry.timestamp || new Date().toISOString(),
            model: entry.message.model || 'unknown',
            usage: {
              inputTokens: usage.input_tokens || 0,
              outputTokens: usage.output_tokens || 0,
              cacheCreationTokens: usage.cache_creation_input_tokens || 0,
              cacheReadTokens: usage.cache_read_input_tokens || 0,
            },
            type: entry.type || 'unknown',
            sessionId: entry.sessionId,
            projectName,
          };
          newEntries.push(usageEntry);
          this.allEntries.push(usageEntry);
        }
      } catch {
        // skip
      }
    }

    return newEntries;
  }

  private getProjectNameFromPath(filePath: string): string {
    const projectsDir = path.join(this.claudeDir, 'projects');
    const relative = path.relative(projectsDir, filePath);
    const parts = relative.split(path.sep);
    return parts.length > 0 ? decodeProjectPath(parts[0]) : 'unknown';
  }

  getCurrentSession(): CurrentSessionInfo {
    const now = Date.now();
    const thirtySecondsAgo = now - 30000;

    // Find most recent entries
    const recentEntries = this.allEntries.filter(
      (e) => new Date(e.timestamp).getTime() > thirtySecondsAgo
    );

    const isActive = recentEntries.length > 0;
    const lastEntry = this.allEntries[this.allEntries.length - 1];

    // Calculate session totals for the current session
    const currentSessionId = lastEntry?.sessionId;
    const sessionEntries = currentSessionId
      ? this.allEntries.filter((e) => e.sessionId === currentSessionId)
      : this.allEntries.slice(-100);

    let totalInput = 0;
    let totalOutput = 0;
    let totalCache = 0;

    for (const entry of sessionEntries) {
      totalInput += entry.usage.inputTokens;
      totalOutput += entry.usage.outputTokens;
      totalCache += entry.usage.cacheCreationTokens + entry.usage.cacheReadTokens;
    }

    // Tokens per minute calculation
    let tokensPerMinute = 0;
    if (sessionEntries.length > 1) {
      const firstTs = new Date(sessionEntries[0].timestamp).getTime();
      const lastTs = new Date(sessionEntries[sessionEntries.length - 1].timestamp).getTime();
      const minutes = (lastTs - firstTs) / 60000;
      if (minutes > 0) {
        tokensPerMinute = Math.round((totalInput + totalOutput) / minutes);
      }
    }

    return {
      isActive,
      sessionId: currentSessionId || null,
      projectName: lastEntry?.projectName || null,
      model: lastEntry?.model || null,
      totalInputTokens: totalInput,
      totalOutputTokens: totalOutput,
      totalCacheTokens: totalCache,
      tokensPerMinute,
      startedAt: currentSessionId
        ? this.sessions.get(currentSessionId)?.startedAt || null
        : null,
      recentEntries: recentEntries.slice(-10),
    };
  }

  getHistoricalUsage(): { hourly: Record<string, TokenUsage>; daily: Record<string, TokenUsage> } {
    const hourly: Record<string, TokenUsage> = {};
    const daily: Record<string, TokenUsage> = {};

    for (const entry of this.allEntries) {
      const date = new Date(entry.timestamp);
      const hourKey = `${date.toISOString().slice(0, 13)}:00`;
      const dayKey = date.toISOString().slice(0, 10);

      if (!hourly[hourKey]) {
        hourly[hourKey] = { inputTokens: 0, outputTokens: 0, cacheCreationTokens: 0, cacheReadTokens: 0 };
      }
      hourly[hourKey].inputTokens += entry.usage.inputTokens;
      hourly[hourKey].outputTokens += entry.usage.outputTokens;
      hourly[hourKey].cacheCreationTokens += entry.usage.cacheCreationTokens;
      hourly[hourKey].cacheReadTokens += entry.usage.cacheReadTokens;

      if (!daily[dayKey]) {
        daily[dayKey] = { inputTokens: 0, outputTokens: 0, cacheCreationTokens: 0, cacheReadTokens: 0 };
      }
      daily[dayKey].inputTokens += entry.usage.inputTokens;
      daily[dayKey].outputTokens += entry.usage.outputTokens;
      daily[dayKey].cacheCreationTokens += entry.usage.cacheCreationTokens;
      daily[dayKey].cacheReadTokens += entry.usage.cacheReadTokens;
    }

    return { hourly, daily };
  }

  getProjects(): ProjectStats[] {
    const projectMap = new Map<string, ProjectStats>();

    for (const entry of this.allEntries) {
      const name = entry.projectName || 'unknown';
      if (!projectMap.has(name)) {
        projectMap.set(name, {
          name,
          path: name,
          totalTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
          sessionCount: 0,
          lastActive: entry.timestamp,
          entries: [],
        });
      }

      const project = projectMap.get(name)!;
      const tokens = entry.usage.inputTokens + entry.usage.outputTokens;
      project.totalTokens += tokens;
      project.inputTokens += entry.usage.inputTokens;
      project.outputTokens += entry.usage.outputTokens;
      project.lastActive = entry.timestamp;
      project.entries.push(entry);
    }

    // Count unique sessions per project
    for (const project of projectMap.values()) {
      const uniqueSessions = new Set(project.entries.map((e) => e.sessionId).filter(Boolean));
      project.sessionCount = uniqueSessions.size || 1;
    }

    return Array.from(projectMap.values()).sort((a, b) => b.totalTokens - a.totalTokens);
  }

  getModelBreakdown(): ModelStats[] {
    const modelMap = new Map<string, ModelStats>();

    for (const entry of this.allEntries) {
      const model = entry.model;
      if (model === 'unknown') continue;

      if (!modelMap.has(model)) {
        const display = getModelDisplay(model);
        modelMap.set(model, {
          model,
          displayName: display.name,
          totalTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
          entryCount: 0,
          color: display.color,
        });
      }

      const stats = modelMap.get(model)!;
      stats.inputTokens += entry.usage.inputTokens;
      stats.outputTokens += entry.usage.outputTokens;
      stats.totalTokens += entry.usage.inputTokens + entry.usage.outputTokens;
      stats.entryCount += 1;
    }

    return Array.from(modelMap.values()).sort((a, b) => b.totalTokens - a.totalTokens);
  }

  getLastModifiedTime(): number {
    return this.lastParseTime;
  }
}
