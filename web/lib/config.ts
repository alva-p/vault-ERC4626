export const env = {
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  vaultAddress: process.env.NEXT_PUBLIC_VAULT_ADDRESS ?? "",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111"),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ?? "",
};

export const sepoliaResources = {
  faucets: [
    { label: "Chainlink Faucet", url: "https://faucets.chain.link/" },
    { label: "Circle Faucet", url: "https://faucet.circle.com/" },
    { label: "Google Cloud Faucet", url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia" },
  ],
};
