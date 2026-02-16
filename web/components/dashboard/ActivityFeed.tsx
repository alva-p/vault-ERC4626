"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { formatUnits } from "viem";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVaultEvents } from "@/hooks/useVaultEvents";
import { useVaultRead } from "@/hooks/useVaultRead";

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function timeAgo(timestamp: number) {
  if (!timestamp) {
    return "—";
  }
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function buildMockItems(seed: number) {
  const rand = seededRandom(seed);
  const now = Math.floor(Date.now() / 1000);
  const owners = [
    "0x5E2c3b3f4D7a8B9c0d1E2F3a4B5c6D7e8F9a0B1c",
    "0x7A1b2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9B",
    "0x9b8A7c6D5e4F3a2B1c0D9e8F7a6B5c4D3e2F1a0B",
  ] as const;

  return Array.from({ length: 3 }).map((_, index) => {
    const isDeposit = rand() > 0.35;
    const assets = BigInt(200 + Math.round(rand() * 1200));
    return {
      type: isDeposit ? ("Deposit" as const) : ("Withdraw" as const),
      assets,
      owner: owners[index % owners.length],
      txHash: `0x${(seed + index).toString(16).padStart(64, "0")}` as `0x${string}`,
      logIndex: index,
      timestamp: now - (index + 1) * (1800 + Math.round(rand() * 2400)),
    };
  });
}

export default function ActivityFeed() {
  const { vaultAddress, decimals, assetSymbol } = useVaultRead();
  const { events, isLoading } = useVaultEvents(vaultAddress);
  const items = events.slice(0, 8);
  const hasRealItems = items.length > 0;
  const [mockSeed, setMockSeed] = useState(() => Math.floor(Date.now() / 3600000));

  useEffect(() => {
    const interval = setInterval(() => {
      setMockSeed(Math.floor(Date.now() / 3600000));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const mockItems = useMemo(() => buildMockItems(mockSeed), [mockSeed]);
  const list = hasRealItems ? items : mockItems;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <CardDescription>Latest vault actions on-chain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted">Loading on-chain activity...</p>}
          {!isLoading && !hasRealItems && <p className="text-sm text-muted">Showing sample activity.</p>}
          {list.map((item) => (
            <motion.div
              key={`${item.type}-${item.txHash}-${item.logIndex}`}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between rounded-2xl border border-stroke bg-glass px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-glass">
                  {item.type === "Deposit" ? (
                    <ArrowDownLeft className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-rose-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{item.type}</p>
                  <p className="text-xs text-muted">{shorten(item.owner)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary">
                  {formatUnits(item.assets, decimals)} {assetSymbol || "ASSET"}
                </p>
                <div className="flex items-center justify-end gap-2 text-xs text-muted">
                  <span>{timeAgo(item.timestamp)}</span>
                  {hasRealItems ? (
                    <a
                      className="text-muted transition hover:text-primary"
                      href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
