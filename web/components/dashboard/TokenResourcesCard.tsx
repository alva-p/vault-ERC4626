"use client";

import { ExternalLink } from "lucide-react";

import { sepoliaResources } from "@/lib/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AddressRow({ label, address }: { label: string; address: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-stroke bg-glass px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
        <p className="text-sm text-primary">{address}</p>
      </div>
      <a
        className="text-muted transition hover:text-primary"
        href={`https://sepolia.etherscan.io/token/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function TokenResourcesCard() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Sepolia Resources</CardTitle>
        <CardDescription>Token addresses + faucets for demo funds.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Faucets</p>
          <div className="flex flex-col gap-2 text-sm">
            {sepoliaResources.faucets.map((faucet) => (
              <a
                key={faucet.url}
                className="flex items-center gap-2 text-primary transition hover:text-accent"
                href={faucet.url}
                target="_blank"
                rel="noreferrer"
              >
                {faucet.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
