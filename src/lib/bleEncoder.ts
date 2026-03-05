import type { NormalizedTx } from '@/types/tx';
import type { BlePayload } from '@/types/ble';

export function encodeTx(tx: NormalizedTx): string {
  const v = tx.valueEth === 0
    ? '0'
    : tx.valueEth < 0.000001
    ? tx.valueEth.toExponential(2)
    : tx.valueEth.toFixed(6).replace(/\.?0+$/, '');

  const payload: BlePayload = {
    t: 'tx',
    v,
    c: tx.chain === 'baseSepolia' ? 'sepolia' : tx.chain,
    d: tx.direction,
  };

  return JSON.stringify(payload); // max ~50 chars
}

export function encodeToBytes(tx: NormalizedTx): Uint8Array {
  return new TextEncoder().encode(encodeTx(tx));
}
