'use client';

import { useMemo } from 'react';
import type { NormalizedTx } from '@/types/tx';

export interface TxStats {
  totalTxs: number;
  totalEthSent: number;
  totalGasEth: number;
  firstTxDate: Date | null;
  baseTxCount: number;
  ethTxCount: number;
}

export function useStats(txs: NormalizedTx[] | undefined): TxStats {
  return useMemo(() => {
    if (!txs || txs.length === 0) {
      return {
        totalTxs: 0,
        totalEthSent: 0,
        totalGasEth: 0,
        firstTxDate: null,
        baseTxCount: 0,
        ethTxCount: 0,
      };
    }

    const outgoing = txs.filter((t) => t.direction === 'out' && !t.isError);
    const totalEthSent = outgoing.reduce((acc, t) => acc + t.valueEth, 0);
    const totalGasEth = txs.reduce((acc, t) => acc + t.gasCostEth, 0);
    const timestamps = txs.map((t) => t.timestamp);
    const firstTxDate = new Date(Math.min(...timestamps) * 1000);

    return {
      totalTxs: txs.length,
      totalEthSent,
      totalGasEth,
      firstTxDate,
      baseTxCount: txs.filter((t) => t.chain === 'base').length,
      ethTxCount: txs.filter((t) => t.chain === 'eth').length,
    };
  }, [txs]);
}
