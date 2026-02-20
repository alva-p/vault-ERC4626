"use client";

import { motion } from "framer-motion";

import CountUp from "@/components/CountUp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVaultRead } from "@/hooks/useVaultRead";

export default function OverviewCard() {
  const { isLoading, totalAssets, totalSupply, pricePerShare, assetSymbol } = useVaultRead();

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Vault Overview</CardTitle>
          <CardDescription>Total assets, shares, and price per share.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">TVL</p>
              <p className="text-2xl font-semibold text-primary">
                <CountUp value={Number(totalAssets)} /> {assetSymbol}
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Total shares</p>
              <p className="text-2xl font-semibold text-primary">
                <CountUp value={Number(totalSupply)} />
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Price per share</p>
              <p className="text-2xl font-semibold text-primary">
                <CountUp value={Number(pricePerShare)} decimals={4} />
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
