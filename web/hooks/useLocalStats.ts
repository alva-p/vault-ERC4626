"use client";

import { useMemo } from "react";

type PricePoint = { time: string; value: number };
type FlowPoint = { time: string; value: number };

function generateSeries(): { price: PricePoint[]; flows: FlowPoint[] } {
  const price: PricePoint[] = [];
  const flows: FlowPoint[] = [];
  let current = 1.02;
  for (let i = 0; i < 14; i += 1) {
    current += Math.sin(i / 2) * 0.01 + 0.003;
    price.push({ time: `D-${13 - i}`, value: Number(current.toFixed(4)) });
    flows.push({ time: `D-${13 - i}`, value: Math.round((Math.sin(i) + 1.2) * 120) - 60 });
  }
  return { price, flows };
}

export function useLocalStats() {
  return useMemo(() => generateSeries(), []);
}
