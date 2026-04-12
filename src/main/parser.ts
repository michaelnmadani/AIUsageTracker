import fs from 'fs';
import path from 'path';
import os from 'os';
import { detectClaudeDataSources, getAllScanDirectories, type ClaudeDataSource } from './paths';
import { AnthropicApiClient, type UsageBucket, type ClaudeCodeUsageBucket } from './api-client';

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
  source?: string; // 'local' | 'api' — where this entry came from
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

export interface DiagnosticInfo {
  sources: ClaudeDataSource[];
  totalEntries: number;
  totalSessions: number;
  apiConnected: boolean;
  apiKeySet: boolean;
  lastApiSync: string | null;
  errors: string[];
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
  const decoded = encoded.replace(/^-/, '/').replace(/-/g, '/');
  const basename = decoded.split('/').filter(Boolean).pop();
  return basename || encoded;
}

export class UsageParser {
  private dataSources: ClaudeDataSource[] = [];
  private allEntries: UsageEntry[] = [];
  private sessions: Map<string, SessionData> = new Map();
  private lastParseTime: number = 0;
  private apiClient: AnthropicApiClient | null = null;
  private apiConnected = false;
  private lastApiSync: string | null = null;
  private errors: string[] = [];
  private customPaths: string[] = [];

  constructor() {
    this.dataSources = detectClaudeDataSources();
    console.log('[Parser] Detected data sources:');
    for (const s of this.dataSources) {
      console.log(`  ${s.exists ? '✓' : '✗'} ${s.label} (${s.kind})`);
    }
  }

  /** Set custom additional paths to scan */
  setCustomPaths(paths: string[]): void {
    this.customPaths = paths;
  }

  /** Set API client for remote usage data */
  setApiClient(client: AnthropicApiClient | null): void {
    this.apiClient = client;
    this.apiConnected = false;
    this.lastApiSync = null;
  }

  /** Full parse of all local data sources */
  parseAll(): void {
    this.errors = [];
    this.allEntries = [];
    this.sessions.clear();

    // Re-detect sources (paths may have been created since last check)
    this.dataSources = detectClaudeDataSources();

    const scanDirs = getAllScanDirectories(this.dataSources);
    console.log('[Parser] Scanning', scanDirs.length, 'data directories');

    for (const { dir, kind, label } of scanDirs) {
      try {
        if (kind === 'claude-code') {
          this.parseClaudeCodeDir(dir);
        } else if (kind === 'claude-desktop-agent') {
          this.parseAgentDir(dir);
        } else if (kind === 'claude-desktop') {
          this.parseDesktopDir(dir);
        }
      } catch (err: any) {
        const msg = `Error scanning ${label}: ${err.message}`;
        console.error('[Parser]', msg);
        this.errors.push(msg);
      }
    }

    // Scan custom paths
    for (const customPath of this.customPaths) {
      if (fs.existsSync(customPath)) {
        try {
          this.scanDirRecursive(customPath, 'Custom');
        } catch (err: any) {
          this.errors.push(`Error scanning custom path ${customPath}: ${err.message}`);
        }
      }
    }

    // Deduplicate entries by timestamp + model + token count
    this.deduplicateEntries();

    // Sort by timestamp
    this.allEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    console.log('[Parser] Total entries after dedup:', this.allEntries.length);
    this.lastParseTime = Date.now();
  }

  /** Parse a Claude Code data directory (~/.claude) */
  private parseClaudeCodeDir(dir: string): void {
    // Parse sessions
    const sessionsDir = path.join(dir, 'sessions');
    if (fs.existsSync(sessionsDir)) {
      this.parseSessions(sessionsDir);
    }

    // Parse project transcripts
    const projectsDir = path.join(dir, 'projects');
    if (fs.existsSync(projectsDir)) {
      this.parseProjectTranscripts(projectsDir);
    }

    // Root-level history.jsonl
    const historyFile = path.join(dir, 'history.jsonl');
    if (fs.existsSync(historyFile)) {
      this.parseJsonlFiles(dir, 'History');
    }
  }

  /** Parse Claude Desktop agent mode sessions */
  private parseAgentDir(dir: string): void {
    if (!fs.existsSync(dir)) return;
    console.log('[Parser] Scanning agent sessions:', dir);

    const jsonlFiles = this.findJsonlFilesRecursive(dir);
    console.log('[Parser] Found', jsonlFiles.length, 'JSONL files in agent sessions');

    for (const filePath of jsonlFiles) {
      let projectName = 'Claude Desktop';
      const pathParts = filePath.split(path.sep);
      for (const part of pathParts) {
        if (part.startsWith('-sessions-')) {
          projectName = part.replace('-sessions-', '').replace(/-/g, ' ');
          projectName = projectName.replace(/\b\w/g, (c) => c.toUpperCase());
          break;
        }
      }
      this.parseJsonlFiles(path.dirname(filePath), projectName);
    }
  }

  /** Parse Claude Desktop data directory for any usage data */
  private parseDesktopDir(dir: string): void {
    if (!fs.existsSync(dir)) return;

    // Look for any JSONL files that might contain usage info
    // (agent mode is handled separately, but there may be other data)
    const jsonlFiles = this.findJsonlFilesRecursive(dir, 5);
    for (const filePath of jsonlFiles) {
      // Skip agent mode files (handled by parseAgentDir)
      if (filePath.includes('local-agent-mode-sessions')) continue;
      this.parseJsonlFiles(path.dirname(filePath), 'Claude Desktop');
    }
  }

  /** Recursively scan a directory for JSONL files and parse them */
  private scanDirRecursive(dir: string, projectName: string): void {
    const jsonlFiles = this.findJsonlFilesRecursive(dir);
    for (const filePath of jsonlFiles) {
      this.parseJsonlFiles(path.dirname(filePath), projectName);
    }
  }

  private findJsonlFilesRecursive(dir: string, maxDepth: number = 10): string[] {
    const results: string[] = [];
    if (maxDepth <= 0) return results;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile() && entry.name.endsWith('.jsonl')) {
          results.push(fullPath);
        } else if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          results.push(...this.findJsonlFilesRecursive(fullPath, maxDepth - 1));
        }
      }
    } catch {
      // Permission denied or other error
    }

    return results;
  }

  private parseSessions(sessionsDir: string): void {
    try {
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
    } catch {
      // skip inaccessible dirs
    }
    console.log('[Parser] Found', this.sessions.size, 'sessions');
  }

  private parseProjectTranscripts(projectsDir: string): void {
    try {
      const projectDirs = fs.readdirSync(projectsDir);
      for (const projectDir of projectDirs) {
        if (projectDir.startsWith('.')) continue;

        const projectPath = path.join(projectsDir, projectDir);
        try {
          const stat = fs.statSync(projectPath);
          if (!stat.isDirectory()) continue;
        } catch {
          continue;
        }

        const projectName = decodeProjectPath(projectDir);

        // JSONL files directly in project dir
        this.parseJsonlFiles(projectPath, projectName);

        // Session subdirectories
        try {
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
              // skip
            }
          }
        } catch {
          // skip
        }
      }
    } catch {
      // skip
    }
  }

  private parseJsonlFiles(dir: string, projectName: string): void {
    try {
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n').filter((line) => line.trim());

          for (const line of lines) {
            try {
              const entry = JSON.parse(line);
              this.extractUsageFromEntry(entry, projectName, 'local');
            } catch {
              // skip malformed lines
            }
          }
        } catch {
          // skip unreadable files
        }
      }
    } catch {
      // skip inaccessible directories
    }
  }

  /** Extract usage data from a parsed JSONL entry, handling multiple formats */
  private extractUsageFromEntry(entry: any, projectName: string, source: string): void {
    // Format 1: message.usage (standard Claude Code CLI format)
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
        source,
      });
    }

    // Format 2: Top-level usage (some Desktop/older formats)
    if (entry.usage && !entry.message?.usage) {
      const usage = entry.usage;
      this.allEntries.push({
        timestamp: entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString(),
        model: entry.model || 'unknown',
        usage: {
          inputTokens: usage.input_tokens || usage.inputTokens || 0,
          outputTokens: usage.output_tokens || usage.outputTokens || 0,
          cacheCreationTokens: usage.cache_creation_input_tokens || usage.cacheCreationTokens || 0,
          cacheReadTokens: usage.cache_read_input_tokens || usage.cacheReadTokens || 0,
        },
        type: entry.type || 'unknown',
        sessionId: entry.sessionId,
        projectName,
        source,
      });
    }

    // Format 3: costUSD / tokens summary (some analytics formats)
    if (entry.input_tokens != null && entry.output_tokens != null && !entry.usage && !entry.message?.usage) {
      this.allEntries.push({
        timestamp: entry.timestamp || entry.date || new Date().toISOString(),
        model: entry.model || 'unknown',
        usage: {
          inputTokens: entry.input_tokens || 0,
          outputTokens: entry.output_tokens || 0,
          cacheCreationTokens: entry.cache_creation_input_tokens || 0,
          cacheReadTokens: entry.cache_read_input_tokens || 0,
        },
        type: entry.type || 'api',
        sessionId: entry.sessionId || entry.session_id,
        projectName,
        source,
      });
    }
  }

  /** Remove duplicate entries (same timestamp + model + tokens) */
  private deduplicateEntries(): void {
    const seen = new Set<string>();
    this.allEntries = this.allEntries.filter((entry) => {
      const key = `${entry.timestamp}|${entry.model}|${entry.usage.inputTokens}|${entry.usage.outputTokens}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /** Fetch usage data from the Anthropic API and merge with local data */
  async syncFromApi(): Promise<{ fetched: number; error?: string }> {
    if (!this.apiClient) {
      return { fetched: 0, error: 'No API key configured' };
    }

    try {
      // Fetch last 30 days of data
      const endDate = new Date().toISOString().slice(0, 10);
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      console.log('[Parser] Fetching API usage from', startDate, 'to', endDate);

      // Fetch both Messages API usage and Claude Code usage in parallel
      const [messagesBuckets, claudeCodeBuckets] = await Promise.all([
        this.apiClient.getMessagesUsage(startDate, endDate).catch((err) => {
          console.warn('[Parser] Messages usage fetch failed:', err);
          return [] as UsageBucket[];
        }),
        this.apiClient.getClaudeCodeUsage(startDate, endDate).catch((err) => {
          console.warn('[Parser] Claude Code usage fetch failed:', err);
          return [] as ClaudeCodeUsageBucket[];
        }),
      ]);

      let fetchedCount = 0;

      // Convert Messages API buckets to UsageEntry format
      for (const bucket of messagesBuckets) {
        if (bucket.input_tokens === 0 && bucket.output_tokens === 0) continue;

        const cacheCreation =
          (bucket.cache_creation?.ephemeral_1h_input_tokens || 0) +
          (bucket.cache_creation?.ephemeral_5m_input_tokens || 0);

        this.allEntries.push({
          timestamp: bucket.started_at,
          model: bucket.model || 'unknown',
          usage: {
            inputTokens: bucket.input_tokens,
            outputTokens: bucket.output_tokens,
            cacheCreationTokens: cacheCreation,
            cacheReadTokens: bucket.cache_read_input_tokens || 0,
          },
          type: 'api',
          projectName: 'API Usage',
          source: 'api',
        });
        fetchedCount++;
      }

      // Convert Claude Code buckets to UsageEntry format
      for (const bucket of claudeCodeBuckets) {
        if (bucket.input_tokens === 0 && bucket.output_tokens === 0) continue;

        this.allEntries.push({
          timestamp: `${bucket.date}T12:00:00Z`,
          model: 'claude-code',
          usage: {
            inputTokens: bucket.input_tokens,
            outputTokens: bucket.output_tokens,
            cacheCreationTokens: bucket.cache_creation_input_tokens || 0,
            cacheReadTokens: bucket.cache_read_input_tokens || 0,
          },
          type: 'claude-code',
          projectName: 'Claude Code (API)',
          source: 'api',
        });
        fetchedCount++;
      }

      // Re-deduplicate and sort
      this.deduplicateEntries();
      this.allEntries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      this.apiConnected = true;
      this.lastApiSync = new Date().toISOString();

      console.log('[Parser] API sync complete:', fetchedCount, 'entries fetched');
      return { fetched: fetchedCount };
    } catch (err: any) {
      this.apiConnected = false;
      const error = `API sync failed: ${err.message}`;
      this.errors.push(error);
      console.error('[Parser]', error);
      return { fetched: 0, error };
    }
  }

  /** Parse new lines from a watched file (incremental) */
  parseNewLines(filePath: string, newContent: string): UsageEntry[] {
    const projectName = this.getProjectNameFromPath(filePath);
    const newEntries: UsageEntry[] = [];
    const lines = newContent.split('\n').filter((line) => line.trim());

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const beforeCount = this.allEntries.length;
        this.extractUsageFromEntry(entry, projectName, 'local');

        // Collect newly added entries
        for (let i = beforeCount; i < this.allEntries.length; i++) {
          newEntries.push(this.allEntries[i]);
        }
      } catch {
        // skip
      }
    }

    return newEntries;
  }

  private getProjectNameFromPath(filePath: string): string {
    // Check against all Claude Code directories
    for (const source of this.dataSources) {
      if (source.kind === 'claude-code') {
        const projectsDir = path.join(source.path, 'projects');
        if (filePath.startsWith(projectsDir)) {
          const relative = path.relative(projectsDir, filePath);
          const parts = relative.split(path.sep);
          return parts.length > 0 ? decodeProjectPath(parts[0]) : 'unknown';
        }
      }
    }

    // Check for Claude Desktop agent mode
    if (filePath.includes('local-agent-mode-sessions')) {
      return 'Claude Desktop';
    }

    return 'unknown';
  }

  // --- Query methods ---

  getCurrentSession(): CurrentSessionInfo {
    const now = Date.now();
    const thirtySecondsAgo = now - 30000;

    const recentEntries = this.allEntries.filter(
      (e) => new Date(e.timestamp).getTime() > thirtySecondsAgo
    );

    const isActive = recentEntries.length > 0;
    const lastEntry = this.allEntries[this.allEntries.length - 1];

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
      if (isNaN(date.getTime())) continue;

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

  getDiagnostics(): DiagnosticInfo {
    return {
      sources: this.dataSources,
      totalEntries: this.allEntries.length,
      totalSessions: this.sessions.size,
      apiConnected: this.apiConnected,
      apiKeySet: this.apiClient !== null,
      lastApiSync: this.lastApiSync,
      errors: [...this.errors],
    };
  }

  getLastModifiedTime(): number {
    return this.lastParseTime;
  }
}
