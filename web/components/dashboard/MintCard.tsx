"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { erc20Abi } from "@/lib/abi/erc20";
import { alvaTokenAbi } from "@/lib/abi/alvaToken";
import { useVaultRead } from "@/hooks/useVaultRead";

const FAUCET_AMOUNT = 1000;

function formatCooldown(seconds: bigint) {
  if (seconds === 0n) {
    return "Ready";
  }
  const minutes = Number(seconds) / 60;
  if (minutes < 60) {
    return `${Math.ceil(minutes)}m`;
  }
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

export default function MintCard() {
  const { address, isConnected } = useAccount();
  const { assetAddress, assetSymbol, decimals, isConfigured } = useVaultRead();
  const { writeContractAsync } = useWriteContract();

  const balanceQuery = useReadContract({
    abi: erc20Abi,
    address: assetAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && assetAddress) },
  });

  const cooldownQuery = useReadContract({
    abi: alvaTokenAbi,
    address: assetAddress,
    functionName: "remainingCooldown",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address && assetAddress) },
  });

  const balance = (balanceQuery.data as bigint | undefined) ?? 0n;
  const remaining = (cooldownQuery.data as bigint | undefined) ?? 0n;

  const balanceDisplay = useMemo(() => {
    return formatUnits(balance, decimals);
  }, [balance, decimals]);

  const handleMint = async () => {
    if (!assetAddress) {
      return;
    }
    try {
      await writeContractAsync({
        abi: alvaTokenAbi,
        address: assetAddress,
        functionName: "mintFaucet",
      });
      toast.success("Tokens minted", { description: "Check your balance or deposit to the vault." });
    } catch (error) {
      toast.error("Mint failed", { description: (error as Error).message });
    }
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Mint {FAUCET_AMOUNT} {assetSymbol || "Token"}</CardTitle>
          <CardDescription>Faucet with 24h cooldown per wallet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-stroke bg-glass px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Balance</p>
              <p className="text-sm text-primary">{balanceDisplay}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Cooldown</p>
              <p className="text-sm text-primary">{formatCooldown(remaining)}</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleMint}
            disabled={!isConfigured || !isConnected || remaining > 0n}
          >
            <Droplets className="h-4 w-4" />
            {remaining > 0n ? "Cooldown active" : "Mint tokens"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
