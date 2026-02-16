# Simple ERC-4626 Vault UI

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file in this folder:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_VAULT_ADDRESS=0xYourVaultAddress
```

## Notes

- The dashboard reads on-chain data from the ERC-4626 vault and its underlying asset.
- Charts and activity feed are derived from on-chain events (no mocks).

## Sepolia Resources

- Faucets:
	- https://faucets.chain.link/
	- https://faucet.circle.com/
	- https://cloud.google.com/application/web3/faucet/ethereum/sepolia
