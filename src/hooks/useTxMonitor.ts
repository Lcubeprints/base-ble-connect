'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { NormalizedTx, Network } from '@/types/tx';

const MAX_RECENT = 20;
const POLL_INTERVAL = 15_000;

interface UseTxMonitorOptions {
  initialTxs?: NormalizedTx[];
  onNewTx?: (tx: NormalizedTx) => void;
  network?: Network;
}

export function useTxMonitor(address: string, options: UseTxMonitorOptions = {}) {
  const { network = 'mainnet' } = options;
  const baseChain = network === 'testnet' ? 'baseSepolia' : 'base';

  const [recentTxs, setRecentTxs] = useState<NormalizedTx[]>([]);
  const [newTxCount, setNewTxCount] = useState(0);

  const lastBlockBase = useRef<number>(-1);
  const lastBlockEth = useRef<number>(-1);
  const onNewTxRef = useRef(options.onNewTx);
  onNewTxRef.current = options.onNewTx;

  const { initialTxs } = options;
  const seeded = useRef(false);

  // Re-seed when network switches
  useEffect(() => {
    seeded.current = false;
    lastBlockBase.current = -1;
    lastBlockEth.current = -1;
    setRecentTxs([]);
    setNewTxCount(0);
  }, [network]);

  useEffect(() => {
    if (!initialTxs || seeded.current) return;
    seeded.current = true;

    const sorted = [...initialTxs].sort((a, b) => b.timestamp - a.timestamp);
    setRecentTxs(sorted.slice(0, MAX_RECENT));

    let baseMax = 0;
    let ethMax = 0;
    initialTxs.forEach((tx) => {
      if ((tx.chain === 'base' || tx.chain === 'baseSepolia') && tx.blockNumber > baseMax)
        baseMax = tx.blockNumber;
      if (tx.chain === 'eth' && tx.blockNumber > ethMax)
        ethMax = tx.blockNumber;
    });
    lastBlockBase.current = baseMax;
    lastBlockEth.current = ethMax;
  }, [initialTxs]);

  const pollChain = useCallback(
    async (chain: string, lastBlock: React.MutableRefObject<number>) => {
      if (!address || lastBlock.current < 0) return [];
      try {
        const startblock = lastBlock.current + 1;
        const res = await fetch(
          `/api/transactions?address=${address}&chain=${chain}&startblock=${startblock}`
        );
        if (!res.ok) return [];
        const data = await res.json();
        if (!Array.isArray(data)) return [];
        const txs = data as NormalizedTx[];
        if (txs.length > 0) {
          lastBlock.current = Math.max(...txs.map((t) => t.blockNumber));
        }
        return txs;
      } catch {
        return [];
      }
    },
    [address]
  );

  useEffect(() => {
    if (!address) return;

    const interval = setInterval(async () => {
      if (lastBlockBase.current < 0 && lastBlockEth.current < 0) return;

      const [newBase, newEth] = await Promise.all([
        pollChain(baseChain, lastBlockBase),
        pollChain('eth', lastBlockEth),
      ]);

      const allNew = [...newBase, ...newEth].sort((a, b) => b.timestamp - a.timestamp);
      if (allNew.length > 0) {
        setNewTxCount((prev) => prev + allNew.length);
        setRecentTxs((prev) => [...allNew, ...prev].slice(0, MAX_RECENT));
        allNew.forEach((tx) => {
          onNewTxRef.current?.(tx);
        });
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [address, baseChain, pollChain]);

  return { recentTxs, newTxCount };
}
