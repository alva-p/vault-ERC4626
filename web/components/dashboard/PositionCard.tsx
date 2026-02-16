"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

import CountUp from "@/components/CountUp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVaultRead } from "@/hooks/useVaultRead";

export default function PositionCard() {
  const { isLoading, userShares, pricePerShare, assetSymbol } = useVaultRead();
  const assetsEquivalent = Number(userShares) * Number(pricePerShare);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Position</CardTitle>
          <CardDescription>Shares held and asset equivalent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Your shares</p>
              <p className="text-2xl font-semibold text-primary">
                <CountUp value={Number(userShares)} />
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted">
                Assets equivalent
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-stroke text-[10px]">
                  ?
                </span>
              </div>
              <p className="text-2xl font-semibold text-primary">
                <CountUp value={assetsEquivalent} /> {assetSymbol}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted">
            <Wallet className="h-4 w-4" />
            Wallet connected metrics update live.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
