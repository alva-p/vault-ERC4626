"use client";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "viem";

import { env } from "@/lib/config";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: " ERC-4626 Vault",
  projectId: env.walletConnectProjectId || "demo",
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: env.rpcUrl ? http(env.rpcUrl) : http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
