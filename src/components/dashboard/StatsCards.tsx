'use client';

import { Activity, ArrowUpRight, Zap, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { TxStats } from '@/hooks/useStats';
import { format } from 'date-fns';

interface Props {
  stats: TxStats;
  isLoading?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      {isLoading ? (
        <div className="h-7 bg-gray-800 rounded animate-pulse w-20" />
      ) : (
        <div className="text-xl font-bold text-white leading-none">{value}</div>
      )}
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</div>
      {sub && <div className="text-[10px] text-gray-600">{sub}</div>}
    </Card>
  );
}

export function StatsCards({ stats, isLoading }: Props) {
  const ethSentLabel = stats.totalEthSent < 0.0001 && stats.totalEthSent > 0
    ? '< 0.0001 ETH'
    : `${stats.totalEthSent.toFixed(4)} ETH`;

  const gasLabel = stats.totalGasEth < 0.0001 && stats.totalGasEth > 0
    ? '< 0.0001 ETH'
    : `${stats.totalGasEth.toFixed(4)} ETH`;

  const firstTx = stats.firstTxDate
    ? format(stats.firstTxDate, 'MMM d, yyyy')
    : '—';

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icon={Activity}
        label="Transactions"
        value={isLoading ? '—' : stats.totalTxs.toLocaleString()}
        sub={`${stats.baseTxCount} Base · ${stats.ethTxCount} ETH`}
        color="bg-[#0052FF]/10 text-[#0052FF]"
        isLoading={isLoading}
      />
      <StatCard
        icon={ArrowUpRight}
        label="ETH Sent"
        value={isLoading ? '—' : ethSentLabel}
        color="bg-purple-500/10 text-purple-400"
        isLoading={isLoading}
      />
      <StatCard
        icon={Zap}
        label="Gas Spent"
        value={isLoading ? '—' : gasLabel}
        color="bg-yellow-500/10 text-yellow-400"
        isLoading={isLoading}
      />
      <StatCard
        icon={Calendar}
        label="First Tx"
        value={isLoading ? '—' : firstTx}
        color="bg-green-500/10 text-green-400"
        isLoading={isLoading}
      />
    </div>
  );
}
