export function compactNumber(value: number, digits = 1): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(digits)}k`;
  return Math.round(value).toLocaleString();
}

export function money(value: number): string {
  if (value === 0) return '$0.00';
  if (Math.abs(value) < 0.01) return '<$0.01';
  return `$${value.toFixed(2)}`;
}

/** Bits per second → a value/unit pair so the UI can style them separately. */
export function bitrate(bps: number): { value: string; unit: string } {
  if (bps >= 1e9) return { value: (bps / 1e9).toFixed(2), unit: 'Gb/s' };
  if (bps >= 1e6) return { value: (bps / 1e6).toFixed(1), unit: 'Mb/s' };
  if (bps >= 1e3) return { value: (bps / 1e3).toFixed(0), unit: 'kb/s' };
  return { value: Math.round(bps).toString(), unit: 'b/s' };
}

export function bytes(value: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let size = value;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function duration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${total}s`;
}

export function relativeTime(timestamp: number): string {
  const delta = Date.now() - timestamp;
  const future = delta < 0;
  const seconds = Math.abs(delta) / 1000;
  if (seconds < 45) return future ? 'in a moment' : 'just now';
  const minutes = seconds / 60;
  if (minutes < 60) return format(Math.round(minutes), 'min', future);
  const hours = minutes / 60;
  if (hours < 24) return format(Math.round(hours), 'hr', future);
  return format(Math.round(hours / 24), 'day', future);
}

function format(value: number, unit: string, future: boolean): string {
  const label = `${value} ${unit}${value === 1 ? '' : 's'}`;
  return future ? `in ${label}` : `${label} ago`;
}

export function clockTime(date: Date, use24h: boolean): { main: string; seconds: string; suffix: string } {
  const hours24 = date.getHours();
  const hours = use24h ? hours24 : hours24 % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    main: `${use24h ? pad(hours) : hours}:${pad(date.getMinutes())}`,
    seconds: pad(date.getSeconds()),
    suffix: use24h ? '' : hours24 < 12 ? 'AM' : 'PM',
  };
}

export function dayLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.floor((date.getTime() - today.getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function timeOfDay(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
