const ROOT_URL = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // Fill these after signing at https://base.dev/preview?tab=account
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'Chain Pulse',
    subtitle: 'Onchain activity tracker',
    description:
      'Visualize your Base and Ethereum transaction history. GitHub-style heatmap, charts, live feed, and ESP32 BLE output.',
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: '#0A0B0D',
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: 'Your chain, visualized.',
    ogTitle: 'Chain Pulse',
    ogDescription: 'Base + ETH transaction analytics in a mini app.',
    ogImageUrl: `${ROOT_URL}/hero.png`,
    primaryCategory: 'finance',
    tags: ['analytics', 'base', 'ethereum', 'transactions', 'ble'],
    screenshotUrls: [] as string[],
    noindex: true, // Set to false after publishing
  },
} as const;
