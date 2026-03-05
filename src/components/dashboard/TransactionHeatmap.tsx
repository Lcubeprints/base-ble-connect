'use client';

import { useMemo, useState } from 'react';
import {
  startOfWeek,
  addDays,
  subDays,
  format,
  getMonth,
  differenceInCalendarWeeks,
  getDay,
} from 'date-fns';
import { Card, CardTitle } from '@/components/ui/Card';
import type { HeatmapData } from '@/hooks/useHeatmapData';

const COLORS = [
  '#1a1f2e', // 0 — no activity
  '#0d2b6b', // 1 — low
  '#0a4ac4', // 2 — medium-low
  '#0052FF', // 3 — medium
  '#3d80ff', // 4 — high
];

const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const WEEKS = 53;
const DAYS = 7;
const LEFT = 20;  // left margin for day labels
const TOP = 22;   // top margin for month labels

const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

function getIntensity(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max <= 3) return 4;
  const ratio = count / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

interface CellData {
  date: Date;
  dateStr: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  week: number;
  dow: number;
  x: number;
  y: number;
}

interface Props {
  heatmapData: HeatmapData;
}

export function TransactionHeatmap({ heatmapData }: Props) {
  const [hovered, setHovered] = useState<CellData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { cells, monthLabels } = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 1 });

    const cells: CellData[] = [];
    const seenMonths = new Set<number>();
    const monthLabels: { x: number; label: string }[] = [];

    for (let i = 0; i < WEEKS * DAYS; i++) {
      const date = addDays(startDate, i);
      if (date > today) break;

      const week = Math.floor(i / DAYS);
      // getDay: 0=Sun, 1=Mon...6=Sat → convert to Mon=0
      const rawDow = getDay(date);
      const dow = rawDow === 0 ? 6 : rawDow - 1;

      const dateStr = format(date, 'yyyy-MM-dd');
      const count = heatmapData.dayMap.get(dateStr) ?? 0;
      const intensity = getIntensity(count, heatmapData.maxCount);

      const x = week * STEP + LEFT;
      const y = dow * STEP + TOP;

      // Track month labels
      const month = getMonth(date);
      if (!seenMonths.has(month)) {
        seenMonths.add(month);
        monthLabels.push({ x: week * STEP + LEFT, label: format(date, 'MMM') });
      }

      cells.push({ date, dateStr, count, intensity, week, dow, x, y });
    }

    return { cells, monthLabels };
  }, [heatmapData]);

  const svgWidth = WEEKS * STEP + LEFT + 4;
  const svgHeight = DAYS * STEP + TOP + 4;

  return (
    <Card>
      <CardTitle>Activity — Last 12 Months</CardTitle>

      <div className="overflow-x-auto -mx-1 px-1 relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width={svgWidth}
          height={svgHeight}
          className="block"
          onMouseLeave={() => setHovered(null)}
        >
          {/* Month labels */}
          {monthLabels.map((m) => (
            <text
              key={m.label}
              x={m.x}
              y={TOP - 6}
              fontSize={8}
              fill="#4B5563"
              fontFamily="monospace"
            >
              {m.label}
            </text>
          ))}

          {/* Day of week labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={i}
                x={LEFT - 4}
                y={i * STEP + TOP + CELL - 1}
                fontSize={8}
                fill="#4B5563"
                textAnchor="end"
                fontFamily="monospace"
              >
                {label}
              </text>
            ) : null
          )}

          {/* Cells */}
          {cells.map((cell) => (
            <rect
              key={cell.dateStr}
              x={cell.x}
              y={cell.y}
              width={CELL}
              height={CELL}
              rx={2}
              fill={COLORS[cell.intensity]}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={(e) => {
                setHovered(cell);
                const rect = (e.target as SVGRectElement)
                  .closest('svg')!
                  .getBoundingClientRect();
                setTooltipPos({
                  x: cell.x - rect.left,
                  y: cell.y - rect.top,
                });
              }}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-10 pointer-events-none bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white shadow-lg"
            style={{
              left: Math.min(hovered.x + 14, svgWidth - 120),
              top: Math.max(hovered.y - 36, 0),
            }}
          >
            <div className="font-semibold">{format(hovered.date, 'MMM d, yyyy')}</div>
            <div className="text-gray-400">
              {hovered.count === 0 ? 'No transactions' : `${hovered.count} tx${hovered.count !== 1 ? 's' : ''}`}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] text-gray-600">Less</span>
        {COLORS.map((color, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
        ))}
        <span className="text-[10px] text-gray-600">More</span>
      </div>
    </Card>
  );
}
