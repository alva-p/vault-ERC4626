"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";

import AppHeader from "@/components/AppHeader";
import HeroShader from "@/components/HeroShader";
import LandingHero from "@/components/landing/LandingHero";
import { Card } from "@/components/ui/card";
import { useVaultEvents } from "@/hooks/useVaultEvents";
import { useVaultRead } from "@/hooks/useVaultRead";

function formatAmount(value: string, digits = 2) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return "0";
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(numericValue);
}

export default function Home() {
  const { isConfigured, isLoading, totalAssets, pricePerShare, assetSymbol, decimals, vaultAddress } = useVaultRead();
  const { events, isLoading: eventsLoading } = useVaultEvents(vaultAddress);

  const symbolLabel = assetSymbol || "ASSET";

  const tvlLabel = !isConfigured
    ? "Connect vault"
    : isLoading
      ? "Loading..."
      : `${formatAmount(totalAssets, 2)} ${symbolLabel} TVL`;

  const sharePriceLabel = !isConfigured
    ? "Connect vault"
    : isLoading
      ? "Loading..."
      : `1 share = ${formatAmount(pricePerShare, 6)} ${symbolLabel}`;

  const netFlowLabel = useMemo(() => {
    if (!isConfigured) {
      return "Connect vault";
    }
    if (eventsLoading) {
      return "Loading...";
    }
    if (events.length === 0) {
      return "No activity yet";
    }

    let total = 0n;
    events.forEach((event) => {
      total += event.type === "Withdraw" ? -event.assets : event.assets;
    });

    const isNegative = total < 0n;
    const absTotal = isNegative ? -total : total;
    const formatted = formatUnits(absTotal, decimals);
    const signed = `${isNegative ? "-" : ""}${formatAmount(formatted, 2)} ${symbolLabel}`;
    return `Net flow: ${signed}`;
  }, [decimals, events, eventsLoading, isConfigured, symbolLabel]);

  return (
    <div className="page-shell">
      <HeroShader />
      <AppHeader />
      <main className="layout-grid landing-grid">
        <LandingHero />
        <section className="grid gap-6">
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Vault / ERC-4626</p>
              <p className="text-sm text-muted">
                A vault holds an asset and issues shares. ERC-4626 standardizes deposits, withdrawals, and conversions.
              </p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Vault overview</p>
              <p className="text-2xl font-semibold text-primary">{tvlLabel}</p>
              <p className="text-sm text-muted">TVL is read directly from the vault in real time.</p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Precision accounting</p>
              <p className="text-2xl font-semibold text-primary">{sharePriceLabel}</p>
              <p className="text-sm text-muted">Conversion computed on-chain by the vault contract.</p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Flow insights</p>
              <p className="text-2xl font-semibold text-primary">{netFlowLabel}</p>
              <p className="text-sm text-muted">Recent Deposit/Withdraw events used to compute net flow.</p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
