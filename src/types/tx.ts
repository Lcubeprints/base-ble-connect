export type ChainId = 'base' | 'eth' | 'baseSepolia';
export type Network = 'mainnet' | 'testnet';
export type TxDirection = 'in' | 'out' | 'self';

export interface NormalizedTx {
  hash: string;
  from: string;
  to: string;
  valueEth: number;       // ETH value as float (JSON-safe)
  gasCostEth: number;     // gas cost in ETH as float (JSON-safe)
  timestamp: number;
  date: string;           // 'yyyy-MM-dd'
  chain: ChainId;
  direction: TxDirection;
  isError: boolean;
  blockNumber: number;
}

// Raw shape from Basescan / Etherscan txlist API
export interface RawApiTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timeStamp: string;
  blockNumber: string;
  isError: string;
  functionName?: string;
  contractAddress?: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  result: RawApiTx[] | string;
}
