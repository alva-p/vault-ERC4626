"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";

export default function AppHeader() {
  const [helpLang, setHelpLang] = useState<"es" | "en">("es");
  const [helpOpen, setHelpOpen] = useState(false);
  const vaultAddress = "0xa90C4E008b0CB1DBa7A203303cd537dF44408131";
  const assetAddress = "0xFd07C79A795526A5d67B8dF475F173659c4CE080";
  const faucetUrl = "https://cloud.google.com/application/web3/faucet/ethereum/sepolia";

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-stroke px-[6vw] py-6"
    >
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Vault</p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">ERC-4626</p>
        </div>
      </div>
      <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-muted">
        <Link className="transition hover:text-primary" href="/">
          Home
        </Link>
        <Link className="transition hover:text-primary" href="/dashboard">
          Dashboard
        </Link>
      </nav>
      <div className="relative flex items-center gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-stroke bg-glass px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted transition hover:text-primary"
          onClick={() => setHelpOpen((prev) => !prev)}
          type="button"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-stroke text-[10px]">
            ?
          </span>
          How it works?
        </button>
        {helpOpen ? (
          <div className="absolute right-0 top-full z-50 mt-3 w-[26rem] rounded-[20px] border border-stroke bg-[color:var(--bg)] p-4 text-primary shadow-[0_18px_50px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between gap-3 border-b border-stroke pb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">How it works</p>
                <p className="text-sm font-semibold">Vault flow & addresses</p>
              </div>
              <button
                className="rounded-full border border-stroke px-2 py-1 text-[10px] uppercase text-muted hover:text-primary"
                onClick={() => setHelpOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                className={
                  helpLang === "es"
                    ? "rounded-full border border-stroke bg-[color:color-mix(in_srgb,var(--text)_10%,transparent)] px-3 py-1 text-[10px] font-semibold uppercase text-primary"
                    : "rounded-full border border-stroke px-3 py-1 text-[10px] font-semibold uppercase text-muted"
                }
                onClick={() => setHelpLang("es")}
                type="button"
              >
                ES
              </button>
              <button
                className={
                  helpLang === "en"
                    ? "rounded-full border border-stroke bg-[color:color-mix(in_srgb,var(--text)_10%,transparent)] px-3 py-1 text-[10px] font-semibold uppercase text-primary"
                    : "rounded-full border border-stroke px-3 py-1 text-[10px] font-semibold uppercase text-muted"
                }
                onClick={() => setHelpLang("en")}
                type="button"
              >
                EN
              </button>
            </div>
            {helpLang === "es" ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Paso 1</p>
                  <p>Consigue ETH de Sepolia en el faucet.</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Paso 2</p>
                  <p>Mintea 4LVA, aprueba el vault y deposita.</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Paso 3</p>
                  <p>Recibes shares (ERC-20 del vault). Al retirar, se queman y vuelves a 4LVA.</p>
                </div>
                <div className="space-y-2 text-xs">
                  <a className="break-words text-primary" href={faucetUrl} target="_blank" rel="noreferrer">
                    Faucet de Sepolia
                  </a>
                  <a
                    className="break-words text-primary"
                    href={`https://sepolia.etherscan.io/token/${assetAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    4LVA: {assetAddress}
                  </a>
                  <a
                    className="break-words text-primary"
                    href={`https://sepolia.etherscan.io/address/${vaultAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Vault: {vaultAddress}
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Step 1</p>
                  <p>Get Sepolia ETH from the faucet.</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Step 2</p>
                  <p>Mint 4LVA, approve the vault, then deposit.</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-glass px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Step 3</p>
                  <p>You receive shares (vault ERC-20). Withdraw burns shares and returns 4LVA.</p>
                </div>
                <div className="space-y-2 text-xs">
                  <a className="break-words text-primary" href={faucetUrl} target="_blank" rel="noreferrer">
                    Sepolia faucet
                  </a>
                  <a
                    className="break-words text-primary"
                    href={`https://sepolia.etherscan.io/token/${assetAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    4LVA: {assetAddress}
                  </a>
                  <a
                    className="break-words text-primary"
                    href={`https://sepolia.etherscan.io/address/${vaultAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Vault: {vaultAddress}
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : null}
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
