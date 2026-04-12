import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Cross-platform detection of all Claude data directories.
 * Covers Claude Code (CLI, Desktop, IDE, Web) and Claude Desktop app.
 */

export interface ClaudeDataSource {
  /** Human-readable label */
  label: string;
  /** Absolute path on disk */
  path: string;
  /** What kind of data lives here */
  kind: 'claude-code' | 'claude-desktop-agent' | 'claude-desktop';
  /** Whether the path actually exists */
  exists: boolean;
}

/** Glob patterns to watch within a data source directory */
export interface WatchTarget {
  label: string;
  patterns: string[];
}

const HOME = os.homedir();
const PLATFORM = process.platform; // 'darwin' | 'win32' | 'linux'

function appDataDir(): string {
  switch (PLATFORM) {
    case 'darwin':
      return path.join(HOME, 'Library', 'Application Support');
    case 'win32':
      return process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming');
    case 'linux':
      return process.env.XDG_CONFIG_HOME || path.join(HOME, '.config');
    default:
      return path.join(HOME, '.config');
  }
}

/**
 * Return every plausible Claude data directory on this machine.
 * Each entry is tagged with whether it exists on disk.
 */
export function detectClaudeDataSources(): ClaudeDataSource[] {
  const sources: ClaudeDataSource[] = [];

  // --- Claude Code (CLI + Desktop app + IDE extensions) ---
  // All share ~/.claude/ as their canonical data directory
  const claudeCodeDir = path.join(HOME, '.claude');
  sources.push({
    label: 'Claude Code (~/.claude)',
    path: claudeCodeDir,
    kind: 'claude-code',
    exists: fs.existsSync(claudeCodeDir),
  });

  // --- Claude Desktop app (regular chat) — agent mode sessions ---
  // macOS: ~/Library/Application Support/Claude/
  // Windows: %APPDATA%/Claude/
  // Linux: ~/.config/Claude/
  const claudeDesktopDir = path.join(appDataDir(), 'Claude');
  sources.push({
    label: `Claude Desktop (${claudeDesktopDir})`,
    path: claudeDesktopDir,
    kind: 'claude-desktop',
    exists: fs.existsSync(claudeDesktopDir),
  });

  // Agent mode sessions live inside the Desktop dir
  const agentDir = path.join(claudeDesktopDir, 'local-agent-mode-sessions');
  sources.push({
    label: `Claude Desktop Agent Mode`,
    path: agentDir,
    kind: 'claude-desktop-agent',
    exists: fs.existsSync(agentDir),
  });

  // --- Claude Code Desktop app (standalone Electron) ---
  // May use its own Application Support dir on some installs
  const claudeCodeAppDir = path.join(appDataDir(), 'Claude Code');
  if (claudeCodeAppDir !== claudeCodeDir) {
    sources.push({
      label: `Claude Code App (${claudeCodeAppDir})`,
      path: claudeCodeAppDir,
      kind: 'claude-code',
      exists: fs.existsSync(claudeCodeAppDir),
    });
  }

  // --- Alternate capitalization / naming ---
  for (const name of ['claude-code', 'claudecode', 'claude_code']) {
    const altDir = path.join(appDataDir(), name);
    if (altDir !== claudeCodeDir && !sources.some((s) => s.path === altDir)) {
      const exists = fs.existsSync(altDir);
      if (exists) {
        sources.push({
          label: `Claude Code (${altDir})`,
          path: altDir,
          kind: 'claude-code',
          exists,
        });
      }
    }
  }

  return sources;
}

/**
 * Build chokidar watch patterns from the discovered sources.
 */
export function buildWatchTargets(sources: ClaudeDataSource[]): WatchTarget[] {
  const targets: WatchTarget[] = [];

  for (const source of sources) {
    if (!source.exists) continue;

    switch (source.kind) {
      case 'claude-code': {
        const projectsDir = path.join(source.path, 'projects');
        const sessionsDir = path.join(source.path, 'sessions');
        const patterns: string[] = [];

        if (fs.existsSync(projectsDir)) {
          patterns.push(`${projectsDir}/**/*.jsonl`);
        }
        if (fs.existsSync(sessionsDir)) {
          patterns.push(`${sessionsDir}/*.json`);
        }
        // Root-level history
        const historyFile = path.join(source.path, 'history.jsonl');
        if (fs.existsSync(historyFile)) {
          patterns.push(historyFile);
        }

        if (patterns.length > 0) {
          targets.push({ label: source.label, patterns });
        }
        break;
      }

      case 'claude-desktop-agent': {
        if (fs.existsSync(source.path)) {
          targets.push({
            label: source.label,
            patterns: [`${source.path}/**/*.jsonl`],
          });
        }
        break;
      }

      case 'claude-desktop': {
        // Scan for any JSONL files that might contain usage data
        const patterns: string[] = [];
        // Agent mode dir handled separately above
        // Look for any other JSONL files
        const jsonlInRoot = path.join(source.path, '*.jsonl');
        patterns.push(jsonlInRoot);
        // Some versions store conversations.jsonl or similar
        patterns.push(`${source.path}/**/*.jsonl`);
        if (patterns.length > 0) {
          targets.push({ label: source.label, patterns });
        }
        break;
      }
    }
  }

  return targets;
}

/**
 * Get all directories that should be scanned for JSONL data on initial parse.
 */
export function getAllScanDirectories(sources: ClaudeDataSource[]): { dir: string; kind: string; label: string }[] {
  const dirs: { dir: string; kind: string; label: string }[] = [];

  for (const source of sources) {
    if (!source.exists) continue;

    if (source.kind === 'claude-code') {
      dirs.push({ dir: source.path, kind: 'claude-code', label: source.label });
    } else if (source.kind === 'claude-desktop-agent') {
      dirs.push({ dir: source.path, kind: 'claude-desktop-agent', label: source.label });
    } else if (source.kind === 'claude-desktop') {
      dirs.push({ dir: source.path, kind: 'claude-desktop', label: source.label });
    }
  }

  return dirs;
}
