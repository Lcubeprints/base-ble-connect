import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#111318] border border-[#1E2130] rounded-2xl p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h2 className={cn('text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3', className)}>
      {children}
    </h2>
  );
}
