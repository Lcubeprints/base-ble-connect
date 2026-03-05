'use client';

import { useConnect } from 'wagmi';
import { Activity, Bluetooth, Loader2 } from 'lucide-react';

const WALLET_ICONS: Record<string, string> = {
  'Coinbase Wallet': '🔵',
  MetaMask: '🦊',
  Injected: '💼',
  'Farcaster MiniApp': '🟣',
};

export function WalletGate() {
  const { connectors, connect, isPending, variables } = useConnect();

  // Filter out farcasterMiniApp (only works inside Base App)
  const visibleConnectors = connectors.filter(
    (c) => !c.name.toLowerCase().includes('farcaster')
  );

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="w-20 h-20 rounded-3xl bg-[#0052FF]/10 border border-[#0052FF]/30 flex items-center justify-center mb-8">
        <Activity className="w-10 h-10 text-[#0052FF]" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Chain Pulse</h1>
      <p className="text-gray-400 text-center mb-2 text-sm max-w-xs">
        Visualize your onchain activity across Base and Ethereum
      </p>

      {/* Features */}
      <div className="flex flex-col gap-2 mb-10 mt-4 w-full max-w-xs">
        {[
          { icon: '📊', label: 'GitHub-style transaction heatmap' },
          { icon: '📈', label: 'Charts for volume & ETH sent' },
          { icon: '🔴', label: 'Live transaction feed' },
          { icon: '📡', label: 'ESP32 BLE visualization' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-gray-300">
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Connect buttons — one per connector */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        {visibleConnectors.map((connector) => {
          const isLoading = isPending && variables?.connector === connector;
          return (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-3 bg-[#0052FF] hover:bg-[#0047E0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-xl transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-lg leading-none">
                  {WALLET_ICONS[connector.name] ?? '🔗'}
                </span>
              )}
              {isLoading ? 'Connecting...' : `Connect ${connector.name}`}
            </button>
          );
        })}
      </div>

      {/* BLE hint */}
      <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
        <Bluetooth className="w-3 h-3" />
        <span>BLE available on Chrome / Android</span>
      </div>
    </div>
  );
}
