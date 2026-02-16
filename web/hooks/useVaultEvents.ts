"use client";

import { useEffect, useMemo, useState } from "react";
import { parseAbiItem } from "viem";
import { usePublicClient, useWatchContractEvent } from "wagmi";

import { erc4626Abi } from "@/lib/abi/erc4626";

export type VaultEvent = {
  type: "Deposit" | "Withdraw";
  assets: bigint;
  shares: bigint;
  caller: `0x${string}`;
  owner: `0x${string}`;
  receiver?: `0x${string}`;
  txHash: `0x${string}`;
  blockNumber: bigint;
  logIndex: number;
  timestamp: number;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const depositEvent = parseAbiItem(
  "event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares)"
);
const withdrawEvent = parseAbiItem(
  "event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)"
);

export function useVaultEvents(vaultAddress?: `0x${string}`) {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<VaultEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      if (!publicClient || !vaultAddress) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const latest = await publicClient.getBlockNumber();
      const fromBlock = latest > 9n ? latest - 9n : 0n;

      const [depositLogs, withdrawLogs] = await Promise.all([
        publicClient.getLogs({ address: vaultAddress, event: depositEvent, fromBlock, toBlock: latest }),
        publicClient.getLogs({ address: vaultAddress, event: withdrawEvent, fromBlock, toBlock: latest }),
      ]);

      const combined: VaultEvent[] = [...depositLogs, ...withdrawLogs].map((log) => {
        const args = log.args as unknown as {
          caller: `0x${string}`;
          owner: `0x${string}`;
          receiver?: `0x${string}`;
          assets: bigint;
          shares: bigint;
        };

        return {
          type: log.eventName as "Deposit" | "Withdraw",
          assets: args.assets,
          shares: args.shares,
          caller: args.caller,
          owner: args.owner,
          receiver: args.receiver,
          txHash: log.transactionHash as `0x${string}`,
          blockNumber: log.blockNumber ?? 0n,
          logIndex: log.logIndex ?? 0,
          timestamp: 0,
        };
      });

      const uniqueBlocks = Array.from(new Set(combined.map((event) => event.blockNumber)));
      const blockMap = new Map<bigint, number>();
      await Promise.all(
        uniqueBlocks.map(async (blockNumber) => {
          const block = await publicClient.getBlock({ blockNumber });
          blockMap.set(blockNumber, Number(block.timestamp));
        })
      );

      const withTime = combined
        .map((event) => ({
          ...event,
          timestamp: blockMap.get(event.blockNumber) ?? 0,
        }))
        .sort((a, b) => (a.blockNumber === b.blockNumber ? b.logIndex - a.logIndex : Number(b.blockNumber - a.blockNumber)));

      if (isMounted) {
        setEvents(withTime);
        setIsLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [publicClient, vaultAddress]);

  useWatchContractEvent({
    address: vaultAddress,
    abi: erc4626Abi,
    eventName: "Deposit",
    onLogs: async (logs) => {
      if (!publicClient) {
        return;
      }
      const enriched = await Promise.all(
        logs.map(async (log) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber ?? 0n });
          return {
            type: "Deposit" as const,
            assets: (log.args?.assets as bigint) ?? 0n,
            shares: (log.args?.shares as bigint) ?? 0n,
            caller: (log.args?.caller as `0x${string}`) ?? ZERO_ADDRESS,
            owner: (log.args?.owner as `0x${string}`) ?? ZERO_ADDRESS,
            txHash: log.transactionHash as `0x${string}`,
            blockNumber: log.blockNumber ?? 0n,
            logIndex: log.logIndex ?? 0,
            timestamp: Number(block.timestamp),
          };
        })
      );
      setEvents((prev) => [...enriched, ...prev].slice(0, 30));
    },
  });

  useWatchContractEvent({
    address: vaultAddress,
    abi: erc4626Abi,
    eventName: "Withdraw",
    onLogs: async (logs) => {
      if (!publicClient) {
        return;
      }
      const enriched = await Promise.all(
        logs.map(async (log) => {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber ?? 0n });
          return {
            type: "Withdraw" as const,
            assets: (log.args?.assets as bigint) ?? 0n,
            shares: (log.args?.shares as bigint) ?? 0n,
            caller: (log.args?.caller as `0x${string}`) ?? ZERO_ADDRESS,
            owner: (log.args?.owner as `0x${string}`) ?? ZERO_ADDRESS,
            receiver: (log.args?.receiver as `0x${string}`) ?? ZERO_ADDRESS,
            txHash: log.transactionHash as `0x${string}`,
            blockNumber: log.blockNumber ?? 0n,
            logIndex: log.logIndex ?? 0,
            timestamp: Number(block.timestamp),
          };
        })
      );
      setEvents((prev) => [...enriched, ...prev].slice(0, 30));
    },
  });

  return useMemo(() => ({ events, isLoading }), [events, isLoading]);
}
