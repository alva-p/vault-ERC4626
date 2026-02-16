import AppHeader from "@/components/AppHeader";
import HeroShader from "@/components/HeroShader";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ActionsCard from "@/components/dashboard/ActionsCard";
import MintCard from "@/components/dashboard/MintCard";
import OverviewCard from "@/components/dashboard/OverviewCard";
import PositionCard from "@/components/dashboard/PositionCard";
import StatsCard from "@/components/dashboard/StatsCard";
import TokenResourcesCard from "@/components/dashboard/TokenResourcesCard";
import WalletStatus from "@/components/dashboard/WalletStatus";

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <HeroShader />
      <AppHeader />
      <main className="layout-grid dashboard-grid">
        <div className="grid gap-6 lg:col-span-8">
          <WalletStatus />
          <OverviewCard />
          <StatsCard />
        </div>
        <div className="grid gap-6 lg:col-span-4">
          <PositionCard />
          <MintCard />
          <ActionsCard />
          <TokenResourcesCard />
        </div>
        <div className="lg:col-span-12">
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
