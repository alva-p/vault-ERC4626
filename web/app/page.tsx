import AppHeader from "@/components/AppHeader";
import HeroShader from "@/components/HeroShader";
import LandingHero from "@/components/landing/LandingHero";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="page-shell">
      <HeroShader />
      <AppHeader />
      <main className="layout-grid landing-grid">
        <LandingHero />
        <section className="grid gap-6">
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Vault / ERC-4626</p>
              <p className="text-sm text-muted">
                ES: Un vault custodia un asset y emite shares. ERC-4626 estandariza depósitos, retiros y conversiones.
              </p>
              <p className="text-sm text-muted">
                EN: A vault holds an asset and issues shares. ERC-4626 standardizes deposits, withdrawals, and conversions.
              </p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Vault overview</p>
              <p className="text-2xl font-semibold text-primary">$12.4M TVL</p>
              <p className="text-sm text-muted">Share price updates in real-time as yield accrues.</p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Precision accounting</p>
              <p className="text-2xl font-semibold text-primary">1 share = 1.12 assets</p>
              <p className="text-sm text-muted">Preview conversions before you sign any transaction.</p>
            </div>
          </Card>
          <Card className="glass-card">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Flow insights</p>
              <p className="text-2xl font-semibold text-primary">Live activity feed</p>
              <p className="text-sm text-muted">Track deposits, withdraws, and net inflows.</p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
