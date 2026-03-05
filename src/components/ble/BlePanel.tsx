'use client';

import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Bluetooth, BluetoothOff, Zap } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { BleStatusBadge } from './BleStatusBadge';
import { useBle } from '@/hooks/useBle';
import type { NormalizedTx } from '@/types/tx';
import type { BleLogEntry } from '@/types/ble';
import { encodeToBytes } from '@/lib/bleEncoder';
import { formatTimeAgo } from '@/lib/formatters';

export interface BlePanelHandle {
  sendTx: (tx: NormalizedTx) => Promise<void>;
}

export const BlePanel = forwardRef<BlePanelHandle>((_, ref) => {
  const { isSupported, status, deviceName, error, connect, disconnect, sendPayload } = useBle();
  const [log, setLog] = useState<BleLogEntry[]>([]);
  const [logId, setLogId] = useState(0);

  const sendTx = useCallback(
    async (tx: NormalizedTx) => {
      const bytes = encodeToBytes(tx);
      const sent = await sendPayload(bytes);
      if (sent) {
        const entry: BleLogEntry = {
          id: logId,
          payload: new TextDecoder().decode(bytes),
          timestamp: new Date(),
          chain: tx.chain,
          direction: tx.direction,
          value: tx.valueEth === 0 ? '0' : tx.valueEth.toFixed(4),
        };
        setLog((prev) => [entry, ...prev].slice(0, 8));
        setLogId((id) => id + 1);
      }
    },
    [sendPayload, logId]
  );

  useImperativeHandle(ref, () => ({ sendTx }), [sendTx]);

  const isConnecting = status === 'scanning' || status === 'connecting';
  const isConnected = status === 'connected';

  return (
    <Card>
      <CardTitle>ESP32 BLE</CardTitle>

      {/* Status row */}
      <div className="flex items-center justify-between mb-4">
        <BleStatusBadge status={status} deviceName={deviceName} />
        {!isSupported ? (
          <span className="text-xs text-gray-500">Use Chrome/Android</span>
        ) : isConnected ? (
          <button
            onClick={disconnect}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-[#0052FF] hover:bg-[#0047E0] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {isConnecting ? (
              <Spinner className="w-3.5 h-3.5 border-white/30 border-t-white" />
            ) : (
              <Bluetooth className="w-3.5 h-3.5" />
            )}
            {isConnecting ? 'Pairing...' : 'Connect ESP32'}
          </button>
        )}
      </div>

      {/* Error */}
      {error && status === 'error' && (
        <p className="text-xs text-red-400 mb-3 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Unsupported notice */}
      {!isSupported && (
        <div className="flex items-start gap-2 bg-gray-900/60 border border-gray-800 rounded-lg p-3 mb-3">
          <BluetoothOff className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            Web Bluetooth is not available on iOS or Firefox. Open in Chrome
            on desktop or Android to connect your ESP32.
          </p>
        </div>
      )}

      {/* Connected UUIDs info */}
      {isConnected && (
        <div className="text-xs text-gray-500 mb-3 font-mono bg-gray-900/50 rounded-lg px-3 py-2 space-y-0.5">
          <div>SVC: 12345678-…-9012</div>
          <div>CHR: 87654321-…-4321</div>
        </div>
      )}

      {/* Send log */}
      {log.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">Recent sends</span>
          </div>
          <div className="space-y-1.5">
            {log.map((entry) => {
              const isOut  = entry.direction === 'out';
              const isIn   = entry.direction === 'in';
              const isSelf = entry.direction === 'self';
              const flashClass = isOut ? 'ble-new-out' : isIn ? 'ble-new-in' : 'ble-new-self';
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${flashClass}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Direction icon with animation */}
                    <span className={`text-base leading-none ${isIn ? 'text-green-400' : isOut ? 'text-red-400' : 'text-yellow-400'}`}>
                      {isOut  && <span className="arrow-out">↑</span>}
                      {isIn   && <span className="arrow-in">↓</span>}
                      {isSelf && <span className="spin-once">↻</span>}
                    </span>
                    {/* Chain badge */}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        entry.chain === 'base'
                          ? 'bg-[#0052FF]/20 text-[#4D88FF]'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {entry.chain}
                    </span>
                    {/* Value */}
                    <span className={`text-xs font-mono ${isIn ? 'text-green-400' : isOut ? 'text-red-400' : 'text-yellow-400'}`}>
                      {isIn ? '+' : ''}{entry.value} ETH
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600">
                    {formatTimeAgo(Math.floor(entry.timestamp.getTime() / 1000))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isConnected && log.length === 0 && (
        <p className="text-xs text-gray-500 text-center py-3">
          Waiting for new transactions...
        </p>
      )}
    </Card>
  );
});

BlePanel.displayName = 'BlePanel';
