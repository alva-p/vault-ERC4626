"use client";

import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

import { erc4626Abi } from "@/lib/abi/erc4626";
import { useVaultEvents } from "@/hooks/useVaultEvents";

type SeriesPoint = { time: string; value: number };

function formatTimeLabel(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function buildMockSeries(seed: number) {
  const rand = seededRandom(seed);
  const today = new Date();
  const base = new Date(today.getTime());
  base.setDate(base.getDate() - 35);

  const priceSeries: SeriesPoint[] = [];
  const flowSeries: SeriesPoint[] = [];
  let price = 1 + rand() * 0.02;

  for (let i = 0; i < 6; i += 1) {
    const pointDate = new Date(base.getTime());
    pointDate.setDate(pointDate.getDate() + i * 7);
    const label = pointDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    price = Math.max(0.98, price + (rand() - 0.35) * 0.015);
    priceSeries.push({ time: label, value: Number(price.toFixed(4)) });

    const flow = Math.round((rand() - 0.35) * 2000);
    flowSeries.push({ time: label, value: flow });
  }

  return { priceSeries, flowSeries };
}

export function useVaultStats(vaultAddress?: `0x${string}`, decimals = 18) {
  const publicClient = usePublicClient();
  const { events, isLoading: eventsLoading } = useVaultEvents(vaultAddress);
  const [priceSeries, setPriceSeries] = useState<SeriesPoint[]>([]);
  const [flowSeries, setFlowSeries] = useState<SeriesPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mockSeed, setMockSeed] = useState(() => Math.floor(Date.now() / 3600000));

  useEffect(() => {
    const interval = setInterval(() => {
      setMockSeed(Math.floor(Date.now() / 3600000));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const buildSeries = async () => {
      if (!publicClient || !vaultAddress || events.length === 0) {
        const mocks = buildMockSeries(mockSeed);
        setPriceSeries(mocks.priceSeries);
        setFlowSeries(mocks.flowSeries);
        setIsLoading(false);
        return;
      }

      const byBlock = [...events]
        .sort((a, b) => Number(a.blockNumber - b.blockNumber))
        .slice(-12);

      const blockNumbers = Array.from(new Set(byBlock.map((event) => event.blockNumber)));
      const blockMap = new Map<bigint, number>();
      await Promise.all(
        blockNumbers.map(async (blockNumber) => {
          const block = await publicClient.getBlock({ blockNumber });
          blockMap.set(blockNumber, Number(block.timestamp));
        })
      );

      const pricePoints = await Promise.all(
        byBlock.map(async (event) => {
          const price = await publicClient.readContract({
            address: vaultAddress,
            abi: erc4626Abi,
            functionName: "convertToAssets",
            args: [BigInt(1e18)],
            blockNumber: event.blockNumber,
          });
          const timestamp = blockMap.get(event.blockNumber) ?? 0;
          return {
            time: formatTimeLabel(timestamp),
            value: Number(formatUnits(price as bigint, decimals)),
          };
        })
      );

      const flowMap = new Map<string, number>();
      events.forEach((event) => {
        const label = formatTimeLabel(event.timestamp);
        const delta = Number(formatUnits(event.assets, decimals)) * (event.type === "Withdraw" ? -1 : 1);
        flowMap.set(label, (flowMap.get(label) ?? 0) + delta);
      });

      const flows = Array.from(flowMap.entries()).map(([time, value]) => ({ time, value }));

      if (isMounted) {
        setPriceSeries(pricePoints);
        setFlowSeries(flows);
        setIsLoading(false);
      }
    };

    buildSeries();

    return () => {
      isMounted = false;
    };
  }, [publicClient, vaultAddress, decimals, events, mockSeed]);

  return useMemo(
    () => ({ priceSeries, flowSeries, isLoading: isLoading || eventsLoading }),
    [eventsLoading, flowSeries, isLoading, priceSeries]
  );
}
