import { format, formatDistanceToNow } from 'date-fns';

export function formatEth(value: number, decimals = 4): string {
  if (value === 0) return '0 ETH';
  if (value < 0.0001) return `< 0.0001 ETH`;
  return `${value.toFixed(decimals)} ETH`;
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'MMM d, yyyy');
}

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}

export function formatGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}
