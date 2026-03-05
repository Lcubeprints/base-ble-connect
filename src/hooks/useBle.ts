'use client';

import { useState, useRef, useCallback } from 'react';
import type { BleStatus } from '@/types/ble';

const SERVICE_UUID = '12345678-1234-1234-1234-123456789012';
const CHAR_UUID = '87654321-4321-4321-4321-210987654321';

function detectBleSupport(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (!('bluetooth' in navigator)) return false;
  // iOS WebKit does not support Web Bluetooth
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return false;
  return true;
}

export function useBle() {
  const [status, setStatus] = useState<BleStatus>('idle');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const charRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);

  const isSupported = detectBleSupport();

  const connect = useCallback(async () => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }
    setError(null);
    try {
      setStatus('scanning');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
        optionalServices: [SERVICE_UUID],
      });

      deviceRef.current = device;
      setDeviceName(device.name ?? 'ESP32');

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('idle');
        charRef.current = null;
        setDeviceName(null);
      });

      setStatus('connecting');
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      charRef.current = await service.getCharacteristic(CHAR_UUID);
      setStatus('connected');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      setError(msg);
      setStatus('error');
      charRef.current = null;
    }
  }, [isSupported]);

  const disconnect = useCallback(() => {
    deviceRef.current?.gatt?.disconnect();
    charRef.current = null;
    setStatus('idle');
    setDeviceName(null);
  }, []);

  const sendPayload = useCallback(async (bytes: Uint8Array): Promise<boolean> => {
    if (!charRef.current || status !== 'connected') return false;
    try {
      await charRef.current.writeValueWithoutResponse(bytes);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Write failed';
      setError(msg);
      setStatus('error');
      return false;
    }
  }, [status]);

  return {
    isSupported,
    status,
    deviceName,
    error,
    connect,
    disconnect,
    sendPayload,
  };
}
