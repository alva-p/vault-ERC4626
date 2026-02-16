"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Coins } from "lucide-react";
import { toast } from "sonner";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { erc20Abi } from "@/lib/abi/erc20";
import { erc4626Abi } from "@/lib/abi/erc4626";
import { useVaultRead } from "@/hooks/useVaultRead";

export default function ActionsCard() {
  const { address, isConnected } = useAccount();
  const { assetAddress, vaultAddress, decimals, assetSymbol, isConfigured } = useVaultRead();
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  });

  const amountBn = useMemo(() => {
    if (!amount || Number(amount) <= 0) {
      return undefined;
    }
    try {
      return parseUnits(amount, decimals);
    } catch {
      return undefined;
    }
  }, [amount, decimals]);

  const balanceQuery = useReadContract({
    abi: erc20Abi,
    address: assetAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(assetAddress && address) },
  });

  const allowanceQuery = useReadContract({
    abi: erc20Abi,
    address: assetAddress,
    functionName: "allowance",
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    query: { enabled: Boolean(assetAddress && address && vaultAddress) },
  });

  const previewDepositQuery = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "previewDeposit",
    args: amountBn ? [amountBn] : undefined,
    query: { enabled: Boolean(vaultAddress && amountBn) },
  });

  const previewWithdrawQuery = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "previewWithdraw",
    args: amountBn ? [amountBn] : undefined,
    query: { enabled: Boolean(vaultAddress && amountBn) },
  });

  const maxWithdrawQuery = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "maxWithdraw",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(vaultAddress && address) },
  });

  const allowance = (allowanceQuery.data as bigint | undefined) ?? 0n;
  const balance = (balanceQuery.data as bigint | undefined) ?? 0n;
  const needsApproval = Boolean(amountBn && amountBn > allowance);

  const previewDeposit = previewDepositQuery.data as bigint | undefined;
  const previewWithdraw = previewWithdrawQuery.data as bigint | undefined;

  const maxWithdraw = (maxWithdrawQuery.data as bigint | undefined) ?? 0n;
  const exceedsMaxWithdraw = Boolean(amountBn && amountBn > maxWithdraw);

  const handleApprove = async () => {
    if (!assetAddress || !vaultAddress || !amountBn) {
      return;
    }
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: assetAddress,
        functionName: "approve",
        args: [vaultAddress, amountBn],
      });
      setTxHash(hash);
      toast.success("Approval submitted", { description: "Waiting for confirmation..." });
    } catch (error) {
      toast.error("Approval failed", { description: (error as Error).message });
    }
  };

  const handleDeposit = async () => {
    if (!vaultAddress || !amountBn || !address) {
      return;
    }
    try {
      const hash = await writeContractAsync({
        abi: erc4626Abi,
        address: vaultAddress,
        functionName: "deposit",
        args: [amountBn, address],
      });
      setTxHash(hash);
      toast.success("Deposit submitted", { description: "Waiting for confirmation..." });
    } catch (error) {
      toast.error("Deposit failed", { description: (error as Error).message });
    }
  };

  const handleWithdraw = async () => {
    if (!vaultAddress || !amountBn || !address) {
      return;
    }
    try {
      const hash = await writeContractAsync({
        abi: erc4626Abi,
        address: vaultAddress,
        functionName: "withdraw",
        args: [amountBn, address, address],
      });
      setTxHash(hash);
      toast.success("Withdraw submitted", { description: "Waiting for confirmation..." });
    } catch (error) {
      toast.error("Withdraw failed", { description: (error as Error).message });
    }
  };

  const setMaxDeposit = () => {
    setAmount(formatUnits(balance, decimals));
  };

  const setMaxWithdraw = () => {
    setAmount(formatUnits(maxWithdraw, decimals));
  };

  const actionDisabled = !isConfigured || !isConnected || !amountBn || isConfirming;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Deposit or withdraw assets with on-chain previews.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposit" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Amount</label>
                <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  Preview shares:{" "}
                  {previewDeposit ? formatUnits(previewDeposit, 18) : "—"}
                </span>
                <button className="text-primary" onClick={setMaxDeposit} type="button">
                  MAX
                </button>
              </div>
              {needsApproval ? (
                <Button className="w-full" onClick={handleApprove} disabled={actionDisabled}>
                  {isConfirming ? "Approving..." : `Approve ${assetSymbol || "Asset"}`}
                </Button>
              ) : (
                <Button className="w-full" onClick={handleDeposit} disabled={actionDisabled}>
                  {isConfirming ? "Depositing..." : "Deposit assets"}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              )}
            </TabsContent>
            <TabsContent value="withdraw" className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted">Assets</label>
                <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  Preview shares:{" "}
                  {previewWithdraw ? formatUnits(previewWithdraw, 18) : "—"}
                </span>
                <button className="text-primary" onClick={setMaxWithdraw} type="button">
                  MAX
                </button>
              </div>
              <Button className="w-full" onClick={handleWithdraw} disabled={actionDisabled || exceedsMaxWithdraw}>
                {isConfirming ? "Withdrawing..." : "Withdraw assets"}
                <Coins className="h-4 w-4" />
              </Button>
              {activeTab === "withdraw" && maxWithdraw === 0n ? (
                <p className="text-xs text-muted">No withdrawable balance.</p>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
