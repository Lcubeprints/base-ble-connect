import type { ApiResponse, RawApiTx } from '@/types/tx';

// Etherscan v2 API — supports all EVM chains via chainid param
// Per Etherscan skill docs: use endblock=latest, not a hardcoded block number
const BASE_URL = 'https://api.etherscan.io/v2/api';

export async function fetchEthTxs(
  address: string,
  startblock = 0,
  endblock: number | 'latest' = 'latest'
): Promise<RawApiTx[]> {
  const apiKey = process.env.ETHERSCAN_API_KEY ?? '';
  const params = new URLSearchParams({
    chainid: '1',          // Ethereum mainnet
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
