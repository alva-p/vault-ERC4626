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

export function useVaultStats(vaultAddress?: `0x${string}`, decimals = 18) {
  const publicClient = usePublicClient();
  const { events, isLoading: eventsLoading } = useVaultEvents(vaultAddress);
  const [priceSeries, setPriceSeries] = useState<SeriesPoint[]>([]);
  const [flowSeries, setFlowSeries] = useState<SeriesPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const buildSeries = async () => {
      if (!publicClient || !vaultAddress || events.length === 0) {
        setPriceSeries([]);
        setFlowSeries([]);
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
  }, [publicClient, vaultAddress, decimals, events]);

  return useMemo(
    () => ({ priceSeries, flowSeries, isLoading: isLoading || eventsLoading }),
    [eventsLoading, flowSeries, isLoading, priceSeries]
  );
}
