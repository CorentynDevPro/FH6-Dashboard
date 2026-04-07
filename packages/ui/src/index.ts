export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatCredits(value: number): string {
  return `CR ${new Intl.NumberFormat().format(value)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentageColor(value: number): string {
  if (value >= 80) return 'text-green-500';
  if (value >= 60) return 'text-yellow-500';
  if (value >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function classColor(carClass: string): string {
  const colors: Record<string, string> = {
    D: 'bg-gray-500',
    C: 'bg-blue-500',
    B: 'bg-yellow-500',
    A: 'bg-orange-500',
    S1: 'bg-purple-500',
    S2: 'bg-red-500',
    X: 'bg-pink-500',
  };
  return colors[carClass] ?? 'bg-gray-400';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
