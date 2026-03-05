import { NextRequest, NextResponse } from 'next/server';
import { fetchBaseTxs, fetchBaseSepoliaTxs } from '@/lib/basescan';
import { fetchEthTxs } from '@/lib/etherscan';
import { normalizeTxList } from '@/lib/txNormalize';
import type { ChainId } from '@/types/tx';

const VALID_CHAINS: ChainId[] = ['base', 'eth', 'baseSepolia'];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get('address');
  const chain = searchParams.get('chain') as ChainId | null;
  const startblock = parseInt(searchParams.get('startblock') ?? '0', 10);
  // Per Etherscan skill docs: use "latest" rather than a hardcoded block number
  const endblockParam = searchParams.get('endblock');
  const endblock: number | 'latest' = endblockParam ? parseInt(endblockParam, 10) : 'latest';

  if (!address || !chain || !VALID_CHAINS.includes(chain)) {
    return NextResponse.json({ error: 'Missing or invalid params' }, { status: 400 });
  }

  try {
    const rawTxs =
      chain === 'base'          ? await fetchBaseTxs(address, startblock, endblock)
      : chain === 'baseSepolia' ? await fetchBaseSepoliaTxs(address, startblock, endblock)
      :                           await fetchEthTxs(address, startblock, endblock);

    const normalized = normalizeTxList(rawTxs, address, chain);
    return NextResponse.json(normalized);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[/api/transactions] chain=${chain} startblock=${startblock} error:`, msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
