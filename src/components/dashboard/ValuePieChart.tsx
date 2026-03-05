'use client';

import { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import type { NormalizedTx } from '@/types/tx';

const BUCKETS = [
  { label: '< 0.001', min: 0, max: 0.001 },
  { label: '0.001–0.01', min: 0.001, max: 0.01 },
  { label: '0.01–0.1', min: 0.01, max: 0.1 },
  { label: '> 0.1', min: 0.1, max: Infinity },
];

const COLORS = ['#0033CC', '#0052FF', '#4D88FF', '#80AAFF'];

interface Props {
  transactions: NormalizedTx[];
}

export function ValuePieChart({ transactions }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, totalEth } = useMemo(() => {
    const outgoing = transactions.filter(
      (tx) => tx.direction === 'out' && !tx.isError && tx.valueEth > 0
    );

    const totalEth = outgoing.reduce((sum, tx) => sum + tx.valueEth, 0);

    const data = BUCKETS.map((bucket) => {
      const matching = outgoing.filter(
        (tx) => tx.valueEth >= bucket.min && tx.valueEth < bucket.max
      );
      return {
        name: bucket.label,
        count: matching.length,
        totalEth: matching.reduce((sum, tx) => sum + tx.valueEth, 0),
      };
    }).filter((d) => d.count > 0);

    return { data, totalEth };
  }, [transactions]);

  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardTitle>Outgoing ETH Distribution</CardTitle>
      {isEmpty ? (
        <div className="h-36 flex items-center justify-center text-gray-600 text-sm">
          No outgoing ETH transactions
        </div>
      ) : (
        <div className="relative h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={62}
                dataKey="count"
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1C1F28',
                  border: '1px solid #1E2130',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#E5E7EB',
                }}
                formatter={(value, name, props) => {
                  const eth = (props.payload as { totalEth?: number }).totalEth ?? 0;
                  return [`${value ?? 0} txs (${eth.toFixed(4)} ETH)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-white">
              {totalEth < 0.001 ? '< 0.001' : totalEth.toFixed(3)}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">ETH out</span>
          </div>
        </div>
      )}

      {/* Legend */}
      {!isEmpty && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          {data.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <div
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="truncate">{entry.name} ETH</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
