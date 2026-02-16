# Simple ERC-4626 Vault

Proyecto de portfolio que muestra un vault ERC-4626 con UI moderna, flujo de mint/approve/deposit/withdraw, y visualizaciones on-chain.

## Estructura

- Contratos (Foundry): [foundry.toml](foundry.toml), [src](src), [test](test), [script](script)
- Frontend (Next.js): [web](web)

## Flujo (alto nivel)

1) Obtener ETH de Sepolia (faucet) para gas.
2) Mint del asset 4LVA en Sepolia.
3) Approve del token 4LVA al vault.
4) Deposit en el vault (recibes shares del vault, ERC-20).
5) Withdraw quema shares y devuelve 4LVA.

## Direcciones (Sepolia)

- Vault (ERC-4626 / shares): 0xa90C4E008b0CB1DBa7A203303cd537dF44408131
- Asset (4LVA): 0xFd07C79A795526A5d67B8dF475F173659c4CE080
- Faucet: https://cloud.google.com/application/web3/faucet/ethereum/sepolia

## Tecnologias

- Solidity + Foundry (Forge, Cast, Anvil)
- OpenZeppelin Contracts
- Next.js (App Router)
- Wagmi + Viem + RainbowKit
- Tailwind CSS
- Recharts

## UI y datos

- UI lee el vault con `convertToAssets`, `previewDeposit`, `previewWithdraw`, `balanceOf`.
- Graficos: on-chain cuando hay eventos; en modo portfolio hay mocks rotativos por hora.

## Setup local

### Contratos

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

### Variables de entorno (web/.env.local)

```shell
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_VAULT_ADDRESS=0xa90C4E008b0CB1DBa7A203303cd537dF44408131
NEXT_PUBLIC_RPC_URL=https://your-rpc
```

## Deploy

- Frontend: `npm run build`
- Contratos: `forge script ...` (ver [script](script))
```
