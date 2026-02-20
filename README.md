# Simple ERC-4626 Vault

Portfolio project showcasing an ERC-4626 vault with a modern UI, mint/approve/deposit/withdraw flow, and on-chain visualizations.

## Structure

- Contracts (Foundry): [foundry.toml](foundry.toml), [src](src), [test](test), [script](script)
- Frontend (Next.js): [web](web)

## Flow (high level)

1) Get Sepolia ETH (faucet) for gas.
2) Mint the 4LVA asset on Sepolia.
3) Approve 4LVA for the vault.
4) Deposit into the vault (receive ERC-20 vault shares).
5) Withdraw burns shares and returns 4LVA.

## Addresses (Sepolia)

- Vault (ERC-4626 / shares): 0xa90C4E008b0CB1DBa7A203303cd537dF44408131
- Asset (4LVA): 0xFd07C79A795526A5d67B8dF475F173659c4CE080
- Faucet: https://cloud.google.com/application/web3/faucet/ethereum/sepolia

## Technologies

- Solidity + Foundry (Forge, Cast, Anvil)
- OpenZeppelin Contracts
- Next.js (App Router)
- Wagmi + Viem + RainbowKit
- Tailwind CSS
- Recharts

## UI and data

- UI reads the vault via `convertToAssets`, `previewDeposit`, `previewWithdraw`, `balanceOf`.
- Charts use on-chain events; if there is no activity, they stay empty.

## Local setup

### Contracts

```shell
forge build
forge test
```

### Frontend

```shell
cd web
npm install
npm run dev
```

### Environment variables (web/.env.local)

```shell
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_VAULT_ADDRESS=0xa90C4E008b0CB1DBa7A203303cd537dF44408131
NEXT_PUBLIC_RPC_URL=https://your-rpc
```

## Deploy

- Frontend: `npm run build`
- Contracts: `forge script ...` (see [script](script))
```
