'use client';

import { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import type { NormalizedTx } from '@/types/tx';
import { formatAddress, formatTimeAgo } from '@/lib/formatters';

interface Props {
  recentTxs: NormalizedTx[];
}

function TxRow({ tx }: { tx: NormalizedTx }) {
  const isIn = tx.direction === 'in';
  const isSelf = tx.direction === 'self';

  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors">
      {/* Chain badge */}
      <span
        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
          tx.chain === 'base'
            ? 'bg-[#0052FF]/20 text-[#4D88FF]'
            : tx.chain === 'baseSepolia'
            ? 'bg-amber-500/15 text-amber-400'
            : 'bg-purple-900/40 text-purple-300'
        }`}
      >
        {tx.chain === 'baseSepolia' ? 'sepolia' : tx.chain}
      </span>

      {/* Direction icon */}
      {isSelf ? (
        <RefreshCw className="w-3 h-3 text-gray-400 flex-shrink-0" />
      ) : isIn ? (
        <ArrowDownLeft className="w-3 h-3 text-green-400 flex-shrink-0" />
      ) : (
        <ArrowUpRight className="w-3 h-3 text-red-400 flex-shrink-0" />
      )}

      {/* Address */}
      <span className="text-[10px] text-gray-400 font-mono flex-1 truncate">
        {isIn ? formatAddress(tx.from) : formatAddress(tx.to)}
      </span>

      {/* Value */}
      <span
        className={`text-[10px] font-semibold flex-shrink-0 ${
          isSelf
            ? 'text-gray-400'
            : isIn
            ? 'text-green-400'
            : 'text-red-400'
        }`}
      >
        {isSelf ? '—' : isIn ? '+' : '-'}
        {tx.valueEth === 0
          ? '0'
          : tx.valueEth < 0.0001
          ? '< 0.0001'
          : tx.valueEth.toFixed(4)}{' '}
        ETH
      </span>

      {/* Time */}
      <span className="text-[9px] text-gray-600 flex-shrink-0 hidden xs:block">
        {formatTimeAgo(tx.timestamp)}
      </span>
    </div>
  );
}

export function TxTicker({ recentTxs }: Props) {
  const doubled = useMemo(() => [...recentTxs, ...recentTxs], [recentTxs]);
  const isEmpty = recentTxs.length === 0;

  if (isEmpty) {
    return (
      <Card>
        <CardTitle>Live Feed</CardTitle>
        <div className="h-16 flex items-center justify-center text-gray-600 text-sm">
          No transactions yet
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>
        Live Feed
        <span className="ml-2 inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          <span className="text-green-400 normal-case font-normal">live</span>
        </span>
      </CardTitle>

      {/* Static list (no animation for simplicity and accessibility) */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-hide">
        {recentTxs.map((tx) => (
          <TxRow key={`${tx.hash}-${tx.chain}`} tx={tx} />
        ))}
      </div>
    </Card>
  );
}
