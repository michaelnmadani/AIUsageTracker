/**
 * Types shared between the main process, the preload bridge and the renderer.
 * Everything crossing IPC is plain JSON — no class instances, no Dates.
 */

export type PanelId =
  | 'clock'
  | 'weather'
  | 'forecast'
  | 'todos'
  | 'network'
  | 'mail'
  | 'calendar'
  | 'claude'
  | 'printers';

/* ------------------------------------------------------------------ config */

export interface WeatherConfig {
  latitude: number;
  longitude: number;
  locationName: string;
  units: 'metric' | 'imperial';
}

export interface NetworkConfig {
  /** Interface name to meter, or null to sum every non-loopback interface. */
  interfaceName: string | null;
  /** Bytes to pull/push during a manual bandwidth test. */
  speedTestBytes: number;
}

export interface GoogleAccountConfig {
  id: string;
  email: string;
  label: string;
  /** Gmail search used to pick out "important" mail for this account. */
  mailQuery: string;
  /** Calendar ids to merge; empty means "every calendar in the list". */
  calendarIds: string[];
  enabled: boolean;
}

export interface GoogleConfig {
  clientId: string;
  accounts: GoogleAccountConfig[];
}

export type ClaudePlan = 'pro' | 'max5' | 'max20' | 'team' | 'api';

export interface ClaudeConfig {
  plan: ClaudePlan;
  /** Length of the rolling usage window Claude bills against, in hours. */
  sessionWindowHours: number;
  /** Soft budget for the rolling window, in tokens. */
  windowTokenBudget: number;
  /** Pull pay-as-you-go spend from the Usage & Cost Admin API. */
  apiUsageEnabled: boolean;
  /** Optional workspace filter for the Admin API reports. */
  apiWorkspaceId: string;
}

export interface BambuPrinterConfig {
  id: string;
  name: string;
  host: string;
  serial: string;
  enabled: boolean;
}

export type ElegooProtocol = 'sdcp' | 'moonraker';

export interface ElegooPrinterConfig {
  id: string;
  name: string;
  host: string;
  /** sdcp = resin/Centauri family (websocket 3030); moonraker = Neptune/Klipper (7125). */
  protocol: ElegooProtocol;
  port: number;
  enabled: boolean;
}

export interface PrintersConfig {
  bambu: BambuPrinterConfig[];
  elegoo: ElegooPrinterConfig[];
}

export interface GeneralConfig {
  alwaysOnTop: boolean;
  /** How the header greeting addresses you. */
  operatorName: string;
  hiddenPanels: PanelId[];
  clockFormat24h: boolean;
  showSeconds: boolean;
}

export interface AppConfig {
  general: GeneralConfig;
  weather: WeatherConfig;
  network: NetworkConfig;
  google: GoogleConfig;
  claude: ClaudeConfig;
  printers: PrintersConfig;
}

/* ----------------------------------------------------------------- weather */

export interface WeatherNow {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  isDay: boolean;
  weatherCode: number;
  description: string;
  icon: string;
}

export interface ForecastDay {
  date: string;
  weekday: string;
  weatherCode: number;
  description: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  locationName: string;
  units: 'metric' | 'imperial';
  temperatureUnit: string;
  windUnit: string;
  now: WeatherNow;
  forecast: ForecastDay[];
  updatedAt: number;
}

export interface GeocodeResult {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

/* ----------------------------------------------------------------- network */

export interface NetworkSample {
  timestamp: number;
  downloadBps: number;
  uploadBps: number;
}

export interface NetworkData {
  interfaceName: string;
  downloadBps: number;
  uploadBps: number;
  peakDownloadBps: number;
  peakUploadBps: number;
  totalDownloadBytes: number;
  totalUploadBytes: number;
  history: NetworkSample[];
  lastSpeedTest: SpeedTestResult | null;
  updatedAt: number;
}

export interface SpeedTestResult {
  downloadMbps: number;
  uploadMbps: number;
  latencyMs: number;
  ranAt: number;
}

/* -------------------------------------------------------------------- mail */

export interface MailMessage {
  id: string;
  accountId: string;
  accountEmail: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  receivedAt: number;
  unread: boolean;
  starred: boolean;
  important: boolean;
  link: string;
}

export interface MailAccountState {
  accountId: string;
  email: string;
  label: string;
  unreadCount: number;
  error: string | null;
}

export interface MailData {
  accounts: MailAccountState[];
  messages: MailMessage[];
  updatedAt: number;
}

/* ---------------------------------------------------------------- calendar */

export interface CalendarEvent {
  id: string;
  accountId: string;
  accountEmail: string;
  calendarId: string;
  calendarName: string;
  colour: string;
  title: string;
  location: string;
  start: number;
  end: number;
  allDay: boolean;
  hangoutLink: string;
  link: string;
  responseStatus: string;
}

export interface CalendarData {
  events: CalendarEvent[];
  errors: { accountId: string; message: string }[];
  updatedAt: number;
}

/* ------------------------------------------------------------------ claude */

export interface ClaudeModelSlice {
  model: string;
  displayName: string;
  colour: string;
  totalTokens: number;
  costUsd: number;
}

export interface ClaudeBucket {
  label: string;
  tokens: number;
  costUsd: number;
}

/** Pro / Max usage, reconstructed from the local Claude Code transcripts. */
export interface ClaudeSubscriptionUsage {
  available: boolean;
  reason: string | null;
  isActive: boolean;
  activeProject: string | null;
  activeModel: string | null;
  window: {
    hours: number;
    startedAt: number | null;
    endsAt: number | null;
    tokens: number;
    budget: number;
    percentUsed: number;
    costUsd: number;
  };
  today: { tokens: number; costUsd: number; messages: number };
  last7Days: { tokens: number; costUsd: number };
  tokensPerMinute: number;
  models: ClaudeModelSlice[];
  topProjects: { name: string; tokens: number }[];
  hourly: ClaudeBucket[];
}

/** Pay-as-you-go usage, straight from the Anthropic Usage & Cost Admin API. */
export interface ClaudeApiUsage {
  available: boolean;
  reason: string | null;
  today: { tokens: number; costUsd: number };
  last7Days: { tokens: number; costUsd: number };
  last30Days: { tokens: number; costUsd: number };
  daily: ClaudeBucket[];
  models: ClaudeModelSlice[];
  webSearchRequests: number;
  cacheHitRate: number;
}

export interface ClaudeData {
  plan: ClaudePlan;
  subscription: ClaudeSubscriptionUsage;
  api: ClaudeApiUsage;
  updatedAt: number;
}

/* ---------------------------------------------------------------- printers */

export type PrinterState =
  | 'offline'
  | 'idle'
  | 'printing'
  | 'paused'
  | 'finished'
  | 'error'
  | 'connecting';

export interface PrinterStatus {
  id: string;
  name: string;
  brand: 'bambu' | 'elegoo';
  model: string;
  host: string;
  state: PrinterState;
  stateLabel: string;
  jobName: string | null;
  progress: number;
  layer: number | null;
  totalLayers: number | null;
  remainingSeconds: number | null;
  nozzleTemp: number | null;
  nozzleTarget: number | null;
  bedTemp: number | null;
  bedTarget: number | null;
  chamberTemp: number | null;
  fanSpeed: number | null;
  speedLevel: string | null;
  filament: string | null;
  error: string | null;
  updatedAt: number;
}

export interface PrintersData {
  printers: PrinterStatus[];
  updatedAt: number;
}

/* ------------------------------------------------------------------- todos */

export type TodoPriority = 'low' | 'normal' | 'high';

export interface TodoItem {
  id: string;
  title: string;
  notes: string;
  done: boolean;
  priority: TodoPriority;
  dueAt: number | null;
  createdAt: number;
  completedAt: number | null;
  order: number;
}

export interface TodoData {
  items: TodoItem[];
  updatedAt: number;
}

/* ------------------------------------------------------------------ bundle */

export interface DashboardData {
  weather: WeatherData | null;
  network: NetworkData | null;
  mail: MailData | null;
  calendar: CalendarData | null;
  claude: ClaudeData | null;
  printers: PrintersData | null;
  todos: TodoData;
}

export type DataChannel = keyof DashboardData;

export interface ServiceError {
  channel: DataChannel;
  message: string;
  at: number;
}
