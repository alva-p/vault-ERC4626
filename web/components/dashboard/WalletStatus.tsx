"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletStatus() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Wallet</p>
        <p className="text-sm text-primary">Connect to start interacting</p>
      </div>
      <ConnectButton label="Connect Wallet" showBalance={false} chainStatus="icon" />
    </div>
  );
}
