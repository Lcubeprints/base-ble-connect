'use client';

import { useQuery } from '@tanstack/react-query';
import type { NormalizedTx, Network } from '@/types/tx';

async function fetchAllTransactions(address: string, network: Network): Promise<NormalizedTx[]> {
  const baseChain = network === 'testnet' ? 'baseSepolia' : 'base';

  const [baseRes, ethRes] = await Promise.all([
    fetch(`/api/transactions?address=${address}&chain=${baseChain}`),
    fetch(`/api/transactions?address=${address}&chain=eth`),
  ]);

  const [baseData, ethData] = await Promise.all([
    baseRes.json(),
    ethRes.json(),
  ]);

  // Guard: API errors return { error: "..." } — treat as empty rather than throw
  const baseTxs: NormalizedTx[] = Array.isArray(baseData) ? baseData : [];
  const ethTxs: NormalizedTx[]  = Array.isArray(ethData)  ? ethData  : [];

  if (!Array.isArray(baseData)) console.warn('[useTxHistory] base response:', baseData);
  if (!Array.isArray(ethData))  console.warn('[useTxHistory] eth response:',  ethData);

  return [...baseTxs, ...ethTxs].sort((a, b) => b.timestamp - a.timestamp);
}

export function useTxHistory(address: string, network: Network = 'mainnet') {
  return useQuery({
    queryKey: ['txHistory', address, network],
    queryFn: () => fetchAllTransactions(address, network),
    staleTime: 5 * 60 * 1000,
    enabled: !!address,
    refetchOnWindowFocus: false,
  });
}
