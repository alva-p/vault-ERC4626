"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { erc20Abi } from "@/lib/abi/erc20";
import { erc4626Abi } from "@/lib/abi/erc4626";
import { env } from "@/lib/config";

const FALLBACK_DECIMALS = 18;

export function useVaultRead() {
  const { address } = useAccount();
  const vaultAddress = env.vaultAddress as `0x${string}` | undefined;

  const isConfigured = Boolean(vaultAddress);

  const assetAddress = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "asset",
    query: { enabled: isConfigured },
  });

  const totalAssets = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "totalAssets",
    query: { enabled: isConfigured },
  });

  const totalSupply = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "totalSupply",
    query: { enabled: isConfigured },
  });

  const pricePerShare = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "convertToAssets",
    args: [BigInt(1e18)],
    query: { enabled: isConfigured },
  });

  const userShares = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isConfigured && Boolean(address) },
  });

  const previewDeposit = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "previewDeposit",
    args: [BigInt(1e18)],
    query: { enabled: isConfigured },
  });

  const previewRedeem = useReadContract({
    abi: erc4626Abi,
    address: vaultAddress,
    functionName: "previewRedeem",
    args: [BigInt(1e18)],
    query: { enabled: isConfigured },
  });

  const assetDecimals = useReadContract({
    abi: erc20Abi,
    address: (assetAddress.data as `0x${string}` | undefined) ?? undefined,
    functionName: "decimals",
    query: { enabled: Boolean(assetAddress.data) },
  });

  const assetSymbol = useReadContract({
    abi: erc20Abi,
    address: (assetAddress.data as `0x${string}` | undefined) ?? undefined,
    functionName: "symbol",
    query: { enabled: Boolean(assetAddress.data) },
  });

  const decimals = Number(assetDecimals.data ?? FALLBACK_DECIMALS);

  const formatted = useMemo(() => {
    if (!isConfigured) {
      return {
        totalAssets: "0",
        totalSupply: "0",
        pricePerShare: "0",
        userShares: "0",
        assetSymbol: "",
        previewDeposit: "0",
        previewRedeem: "0",
      };
    }

    return {
      totalAssets: formatUnits((totalAssets.data as bigint | undefined) ?? 0n, decimals),
      totalSupply: formatUnits((totalSupply.data as bigint | undefined) ?? 0n, 18),
      pricePerShare: formatUnits((pricePerShare.data as bigint | undefined) ?? 0n, decimals),
      userShares: formatUnits((userShares.data as bigint | undefined) ?? 0n, 18),
      assetSymbol: (assetSymbol.data as string | undefined) ?? "",
      previewDeposit: formatUnits((previewDeposit.data as bigint | undefined) ?? 0n, 18),
      previewRedeem: formatUnits((previewRedeem.data as bigint | undefined) ?? 0n, decimals),
    };
  }, [
    isConfigured,
    totalAssets.data,
    totalSupply.data,
    pricePerShare.data,
    userShares.data,
    assetSymbol.data,
    previewDeposit.data,
    previewRedeem.data,
    decimals,
  ]);

  const isLoading =
    totalAssets.isLoading ||
    totalSupply.isLoading ||
    pricePerShare.isLoading ||
    assetSymbol.isLoading ||
    assetDecimals.isLoading ||
    previewDeposit.isLoading ||
    previewRedeem.isLoading;

  return {
    isConfigured,
    isLoading,
    assetAddress: assetAddress.data as `0x${string}` | undefined,
    vaultAddress,
    decimals,
    ...formatted,
  };
}
