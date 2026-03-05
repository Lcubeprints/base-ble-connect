'use client';

import { useMemo } from 'react';
import type { NormalizedTx } from '@/types/tx';

export interface HeatmapData {
  dayMap: Map<string, number>;
  maxCount: number;
}

export function useHeatmapData(txs: NormalizedTx[] | undefined): HeatmapData {
  return useMemo(() => {
    if (!txs || txs.length === 0) {
      return { dayMap: new Map(), maxCount: 0 };
    }

    const dayMap = new Map<string, number>();
    txs.forEach((tx) => {
      dayMap.set(tx.date, (dayMap.get(tx.date) ?? 0) + 1);
    });

    const maxCount = Math.max(0, ...dayMap.values());
    return { dayMap, maxCount };
  }, [txs]);
}
