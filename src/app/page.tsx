"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/landing/WalletGate";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Spinner } from "@/components/ui/Spinner";

export default function Page() {
  const { address, isConnected, isConnecting } = useAccount();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initFrame = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
      } catch {
        // Not in a mini app context — fine
      } finally {
        setReady(true);
      }
    };
    initFrame();
  }, []);

  if (!ready || isConnecting) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!isConnected || !address) {
    return <WalletGate />;
  }

  return <Dashboard address={address} />;
}
