import type { BleStatus } from '@/types/ble';
import { cn } from '@/lib/utils';

interface Props {
  status: BleStatus;
  deviceName?: string | null;
}

const STATUS_CONFIG: Record<BleStatus, { label: string; color: string; dot: string }> = {
  idle: { label: 'Not connected', color: 'text-gray-400', dot: 'bg-gray-500' },
  scanning: { label: 'Scanning...', color: 'text-yellow-400', dot: 'bg-yellow-400 animate-pulse' },
  connecting: { label: 'Connecting...', color: 'text-blue-400', dot: 'bg-blue-400 animate-pulse' },
  connected: { label: 'Connected', color: 'text-green-400', dot: 'bg-green-400' },
  error: { label: 'Error', color: 'text-red-400', dot: 'bg-red-400' },
  unsupported: { label: 'Not supported', color: 'text-gray-500', dot: 'bg-gray-600' },
};

export function BleStatusBadge({ status, deviceName }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <div className={cn('flex items-center gap-2 text-xs font-medium', config.color)}>
      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', config.dot)} />
      <span>
        {status === 'connected' && deviceName ? deviceName : config.label}
      </span>
    </div>
  );
}
