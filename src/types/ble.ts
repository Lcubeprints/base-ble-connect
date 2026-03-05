export type BleStatus =
  | 'idle'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'unsupported';

export interface BlePayload {
  t: 'tx';
  v: string;  // ETH value string e.g. "0.05"
  c: 'base' | 'eth' | 'sepolia';  // 'sepolia' = Base Sepolia testnet
  d: 'in' | 'out' | 'self';
}

export interface BleLogEntry {
  id: number;
  payload: string;
  timestamp: Date;
  chain: string;
  direction: string;
  value: string;
}
