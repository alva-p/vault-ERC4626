"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVaultRead } from "@/hooks/useVaultRead";
import { useVaultStats } from "@/hooks/useVaultStats";

export default function StatsCard() {
  const { vaultAddress, decimals } = useVaultRead();
  const { priceSeries, flowSeries, isLoading } = useVaultStats(vaultAddress, decimals);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Stats</CardTitle>
          <CardDescription>Derived from on-chain activity.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="h-48">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">Price per share</p>
            {isLoading && <p className="text-sm text-muted">Loading...</p>}
            {!isLoading && priceSeries.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
            {!isLoading && priceSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceSeries}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8ad3ff" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#8ad3ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                <YAxis hide domain={[(dataMin: number) => dataMin - 0.02, (dataMax: number) => dataMax + 0.02]} />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--bg)",
                    border: "1px solid var(--stroke)",
                    borderRadius: 12,
                    color: "var(--text)",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#8ad3ff" fill="url(#priceGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="h-48">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted">Net flows</p>
            {isLoading && <p className="text-sm text-muted">Loading...</p>}
            {!isLoading && flowSeries.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
            {!isLoading && flowSeries.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flowSeries}>
                <XAxis dataKey="time" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--bg)",
                    border: "1px solid var(--stroke)",
                    borderRadius: 12,
                    color: "var(--text)",
                  }}
                />
                <Bar dataKey="value" fill="#f3a25f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
