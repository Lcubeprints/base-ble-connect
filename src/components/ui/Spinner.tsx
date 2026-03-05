import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-5 h-5 border-2 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin',
        className
      )}
    />
  );
}
