import type { ApiResponse, RawApiTx } from '@/types/tx';

// Etherscan v2 API — covers Base mainnet (8453) and Base Sepolia (84532)
// Per Etherscan skill docs: use endblock=latest, not a hardcoded block number
const BASE_URL = 'https://api.etherscan.io/v2/api';

export async function fetchBaseTxs(
  address: string,
  startblock = 0,
  endblock: number | 'latest' = 'latest'
): Promise<RawApiTx[]> {
  const apiKey = process.env.ETHERSCAN_API_KEY ?? '';
  const params = new URLSearchParams({
    chainid: '8453',        // Base mainnet
    module: 'account',
    action: 'txlist',
    address,
    startblock: String(startblock),
    endblock: String(endblock),
    sort: 'asc',
    offset: '10000',
    page: '1',
    ...(apiKey ? { apikey: apiKey } : {}),
  });

  const res = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
  const data: ApiResponse = await res.json();

  if (data.status !== '1' || !Array.isArray(data.result)) {
    return [];
  }

  return data.result;
}

export async function fetchBaseSepoliaTxs(
  address: string,
  startblock = 0,
  endblock: number | 'latest' = 'latest'
): Promise<RawApiTx[]> {
  const apiKey = process.env.ETHERSCAN_API_KEY ?? '';
  const params = new URLSearchParams({
    chainid: '84532',       // Base Sepolia testnet
    module: 'account',
    action: 'txlist',
    address,
    startblock: String(startblock),
    endblock: String(endblock),
    sort: 'asc',
    offset: '10000',
    page: '1',
    ...(apiKey ? { apikey: apiKey } : {}),
  });

  const res = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
  const data: ApiResponse = await res.json();

  if (data.status !== '1' || !Array.isArray(data.result)) {
    console.warn('[fetchBaseSepoliaTxs]', data.message, data.result);
    return [];
  }

  return data.result;
}
