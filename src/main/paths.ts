import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Cross-platform detection of all Claude data directories.
 * Covers Claude Code (CLI, Desktop, IDE, Web) and Claude Desktop app.
 *
 * Key directories:
 * - ~/.claude/projects/                                  — Claude Code CLI + IDE sessions
 * - ~/Library/Application Support/Claude/claude-code-sessions/  — Claude Code inside Claude Desktop
 * - ~/Library/Application Support/Claude/local-agent-mode-sessions/ — Legacy agent mode sessions
 */

export interface ClaudeDataSource {
  label: string;
  path: string;
  kind: 'claude-code' | 'claude-desktop-code-sessions' | 'claude-desktop-agent' | 'claude-desktop';
  exists: boolean;
}

export interface WatchTarget {
  label: string;
  patterns: string[];
}

const HOME = os.homedir();
const PLATFORM = process.platform;

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

export function detectClaudeDataSources(): ClaudeDataSource[] {
  const sources: ClaudeDataSource[] = [];

  // 1. Claude Code CLI + IDE extensions: ~/.claude/
  const claudeCodeDir = path.join(HOME, '.claude');
  sources.push({
    label: 'Claude Code CLI (~/.claude)',
    path: claudeCodeDir,
    kind: 'claude-code',
    exists: fs.existsSync(claudeCodeDir),
  });

  // 2. Claude Desktop app base directory
  const claudeDesktopDir = path.join(appDataDir(), 'Claude');
  sources.push({
    label: 'Claude Desktop',
    path: claudeDesktopDir,
    kind: 'claude-desktop',
    exists: fs.existsSync(claudeDesktopDir),
  });

  // 3. Claude Code sessions inside Claude Desktop (the main one users expect!)
  //    Path: ~/Library/Application Support/Claude/claude-code-sessions/<accountId>/<orgId>/
  const codeSessionsDir = path.join(claudeDesktopDir, 'claude-code-sessions');
  sources.push({
    label: 'Claude Desktop Code Sessions',
    path: codeSessionsDir,
    kind: 'claude-desktop-code-sessions',
    exists: fs.existsSync(codeSessionsDir),
  });

  // 4. Legacy agent mode sessions
  const agentDir = path.join(claudeDesktopDir, 'local-agent-mode-sessions');
  sources.push({
    label: 'Claude Desktop Agent Mode (legacy)',
    path: agentDir,
    kind: 'claude-desktop-agent',
    exists: fs.existsSync(agentDir),
  });

  // 5. Claude Code standalone Desktop app (separate Electron app)
  const claudeCodeAppDir = path.join(appDataDir(), 'Claude Code');
  if (claudeCodeAppDir !== claudeCodeDir) {
    sources.push({
      label: 'Claude Code Desktop App',
      path: claudeCodeAppDir,
      kind: 'claude-code',
      exists: fs.existsSync(claudeCodeAppDir),
    });
  }

  return sources;
}

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
        const historyFile = path.join(source.path, 'history.jsonl');
        if (fs.existsSync(historyFile)) {
          patterns.push(historyFile);
        }

        if (patterns.length > 0) {
          targets.push({ label: source.label, patterns });
        }
        break;
      }

      case 'claude-desktop-code-sessions': {
        // Watch all JSONL files recursively under claude-code-sessions/
        targets.push({
          label: source.label,
          patterns: [`${source.path}/**/*.jsonl`],
        });
        break;
      }

      case 'claude-desktop-agent': {
        targets.push({
          label: source.label,
          patterns: [`${source.path}/**/*.jsonl`],
        });
        break;
      }

      case 'claude-desktop': {
        // Watch root-level JSONL and any new subdirs we haven't explicitly handled
        const patterns: string[] = [];
        const rootJsonl = path.join(source.path, '*.jsonl');
        patterns.push(rootJsonl);
        targets.push({ label: source.label, patterns });
        break;
      }
    }
  }

  return targets;
}

export function getAllScanDirectories(sources: ClaudeDataSource[]): { dir: string; kind: string; label: string }[] {
  const dirs: { dir: string; kind: string; label: string }[] = [];

  for (const source of sources) {
    if (!source.exists) continue;
    dirs.push({ dir: source.path, kind: source.kind, label: source.label });
  }

  return dirs;
}
