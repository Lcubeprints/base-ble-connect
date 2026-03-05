import { createConfig, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  connectors: [
    farcasterMiniApp(),
    metaMask(),
    coinbaseWallet({
      appName: 'Chain Pulse',
      appLogoUrl: `${process.env.NEXT_PUBLIC_URL ?? ''}/icon.png`,
    }),
  ],
  ssr: true,
});
