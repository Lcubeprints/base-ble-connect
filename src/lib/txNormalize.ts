import { format } from 'date-fns';
import type { NormalizedTx, RawApiTx, ChainId } from '@/types/tx';

export function normalizeTx(
  raw: RawApiTx,
  address: string,
  chain: ChainId
): NormalizedTx {
  // Use BigInt only locally for arithmetic — never stored in the returned object
  // to avoid JSON.stringify errors (BigInt is not serializable)
  const valueBig = BigInt(raw.value || '0');
  const gasUsedBig = BigInt(raw.gasUsed || '0');
  const gasPriceBig = BigInt(raw.gasPrice || '0');
  const timestamp = parseInt(raw.timeStamp, 10);
  const blockNumber = parseInt(raw.blockNumber, 10);

  const fromLower = raw.from.toLowerCase();
  const toLower = raw.to?.toLowerCase() ?? '';
  const addrLower = address.toLowerCase();

  const direction =
    fromLower === addrLower && toLower === addrLower
      ? 'self'
      : fromLower === addrLower
      ? 'out'
      : 'in';

  const date = format(new Date(timestamp * 1000), 'yyyy-MM-dd');

  return {
    hash: raw.hash,
    from: raw.from,
    to: raw.to ?? '',
    valueEth: Number(valueBig) / 1e18,
    gasCostEth: Number(gasUsedBig * gasPriceBig) / 1e18,
    timestamp,
    date,
    chain,
    direction,
    isError: raw.isError === '1',
    blockNumber,
  };
}

export function normalizeTxList(
  rawList: RawApiTx[],
  address: string,
  chain: ChainId
): NormalizedTx[] {
  return rawList.map((raw) => normalizeTx(raw, address, chain));
}
