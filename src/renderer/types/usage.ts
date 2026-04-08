export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
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

export interface HistoricalUsage {
  hourly: Record<string, TokenUsage>;
  daily: Record<string, TokenUsage>;
}

export interface UsageData {
  current: CurrentSessionInfo;
  history: HistoricalUsage;
  projects: ProjectStats[];
  models: ModelStats[];
  newEntries?: UsageEntry[];
}

export type ClaudeStatus = 'active' | 'idle' | 'offline';

export type CatActivity =
  | 'cooking'    // processing/generating
  | 'reading'    // analyzing files
  | 'sweeping'   // editing code
  | 'typing'     // writing code
  | 'sleeping'   // idle
  | 'gardening'; // decorative

declare global {
  interface Window {
    usageAPI: {
      getCurrent: () => Promise<CurrentSessionInfo>;
      getHistory: () => Promise<HistoricalUsage>;
      getProjects: () => Promise<ProjectStats[]>;
      getModels: () => Promise<ModelStats[]>;
      onUsageUpdate: (callback: (data: UsageData) => void) => () => void;
      onStatusChange: (callback: (status: { isActive: boolean }) => void) => () => void;
      toggleAlwaysOnTop: () => Promise<boolean>;
      minimize: () => Promise<void>;
      close: () => Promise<void>;
    };
  }
}
