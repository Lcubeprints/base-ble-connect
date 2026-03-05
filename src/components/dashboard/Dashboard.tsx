'use client';

import { useRef, useCallback, useState } from 'react';
import { useDisconnect } from 'wagmi';
import { Wallet, LogOut, FlaskConical } from 'lucide-react';
import { useTxHistory } from '@/hooks/useTxHistory';
import { useTxMonitor } from '@/hooks/useTxMonitor';
import { useStats } from '@/hooks/useStats';
import { useHeatmapData } from '@/hooks/useHeatmapData';
import { StatsCards } from './StatsCards';
import { TransactionHeatmap } from './TransactionHeatmap';
import { MonthlyBarChart } from './MonthlyBarChart';
import { ValuePieChart } from './ValuePieChart';
import { TxTicker } from './TxTicker';
import { BlePanel, BlePanelHandle } from '@/components/ble/BlePanel';
import { Spinner } from '@/components/ui/Spinner';
import { formatAddress } from '@/lib/formatters';
import type { NormalizedTx, Network } from '@/types/tx';

interface Props {
  address: string;
}

export function Dashboard({ address }: Props) {
  const { disconnect } = useDisconnect();
  const [network, setNetwork] = useState<Network>('mainnet');
  const isTestnet = network === 'testnet';

  const { data: transactions, isLoading, error } = useTxHistory(address, network);
  const blePanelRef = useRef<BlePanelHandle>(null);

  const handleNewTx = useCallback((tx: NormalizedTx) => {
    blePanelRef.current?.sendTx(tx);
  }, []);

  const { recentTxs, newTxCount } = useTxMonitor(address, {
    initialTxs: transactions,
    onNewTx: handleNewTx,
    network,
  });

  const stats = useStats(transactions);
  const heatmapData = useHeatmapData(transactions);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0A0B0D]/90 backdrop-blur border-b border-[#1E2130] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center">
            <Wallet className="w-3 h-3 text-[#0052FF]" />
          </div>
          <span className="text-xs text-gray-400 font-mono">{formatAddress(address)}</span>
          {newTxCount > 0 && (
            <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full font-semibold">
              +{newTxCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Testnet toggle */}
          <button
            onClick={() => setNetwork(isTestnet ? 'mainnet' : 'testnet')}
            title={isTestnet ? 'Switch to Mainnet' : 'Switch to Base Sepolia Testnet'}
            className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border transition-colors ${
              isTestnet
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                : 'bg-gray-800/60 border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            <FlaskConical className="w-3 h-3" />
            {isTestnet ? 'Sepolia' : 'Testnet'}
          </button>

          <button
            onClick={() => disconnect()}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Testnet banner */}
      {isTestnet && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center gap-2">
          <FlaskConical className="w-3 h-3 text-amber-400 flex-shrink-0" />
          <span className="text-[10px] text-amber-400 font-medium">
            Base Sepolia Testnet — showing test transactions only
          </span>
        </div>
      )}

      {/* Content */}
      <main className="px-4 py-4 space-y-4 pb-8">
        {error ? (
          <div className="text-center py-12 text-red-400 text-sm">
            Failed to load transactions. Check your connection.
          </div>
        ) : (
          <>
            <StatsCards stats={stats} isLoading={isLoading} />

            {isLoading ? (
              <div className="bg-[#111318] border border-[#1E2130] rounded-2xl p-4 flex items-center justify-center h-28">
                <Spinner />
              </div>
            ) : (
              <TransactionHeatmap heatmapData={heatmapData} />
            )}

            {!isLoading && transactions && transactions.length > 0 && (
              <MonthlyBarChart transactions={transactions} />
            )}

            {!isLoading && transactions && transactions.length > 0 && (
              <ValuePieChart transactions={transactions} />
            )}

            <TxTicker recentTxs={recentTxs} />

            <BlePanel ref={blePanelRef} />
          </>
        )}
      </main>
    </div>
  );
}
