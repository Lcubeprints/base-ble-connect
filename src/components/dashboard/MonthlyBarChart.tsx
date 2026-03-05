'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Card, CardTitle } from '@/components/ui/Card';
import type { NormalizedTx } from '@/types/tx';

interface Props {
  transactions: NormalizedTx[];
}

interface MonthData {
  month: string;
  base: number;
  eth: number;
  total: number;
}

export function MonthlyBarChart({ transactions }: Props) {
  const data = useMemo<MonthData[]>(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(now, 11 - i);
      const start = startOfMonth(date).getTime() / 1000;
      const end = endOfMonth(date).getTime() / 1000;
      const label = format(date, 'MMM');

      const baseTxs = transactions.filter(
        (tx) => tx.chain === 'base' && tx.timestamp >= start && tx.timestamp <= end
      ).length;

      const ethTxs = transactions.filter(
        (tx) => tx.chain === 'eth' && tx.timestamp >= start && tx.timestamp <= end
      ).length;

      return { month: label, base: baseTxs, eth: ethTxs, total: baseTxs + ethTxs };
    });
  }, [transactions]);

  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <Card>
      <CardTitle>Transactions per Month</CardTitle>
      <div className="flex gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0052FF]" />
          Base
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
          Ethereum
        </div>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={12} barGap={2} barCategoryGap="30%">
            <XAxis
              dataKey="month"
              tick={{ fill: '#6B7280', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, maxVal + 1]} />
            <Tooltip
              contentStyle={{
                background: '#1C1F28',
                border: '1px solid #1E2130',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#E5E7EB',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />
            <Bar dataKey="base" name="Base" fill="#0052FF" radius={[3, 3, 0, 0]} />
            <Bar dataKey="eth" name="ETH" fill="#7C3AED" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
