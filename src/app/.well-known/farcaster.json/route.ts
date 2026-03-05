import { NextResponse } from 'next/server';
import { minikitConfig } from '../../../../minikit.config';

export async function GET() {
  return NextResponse.json(minikitConfig, {
    headers: { 'Content-Type': 'application/json' },
  });
}
