import { CalendarCheck, Clock, Flame } from "lucide-react";
import Logo from "../components/auth/Logo.jsx";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";
import DashboardHeader, {
  DashboardHeaderActions,
} from "../components/dashboard/DashboardHeader.jsx";
import DashboardSidebar from "../components/dashboard/DashboardSidebar.jsx";
import MetricCard from "../components/dashboard/MetricCard.jsx";
import ContributionHeatmap from "../components/dashboard/ContributionHeatmap.jsx";
import RecentLogCard from "../components/dashboard/RecentLogCard.jsx";
import GoalsCard from "../components/dashboard/GoalsCard.jsx";
import ActivityCard from "../components/dashboard/ActivityCard.jsx";
import MobileNav from "../components/dashboard/MobileNav.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useDashboard } from "../hooks/useDashboard.js";

const OnTrackBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-600" />
    On track
  </span>
);

const DashboardPage = () => {
  const { dashboard } = useDashboard();
  const { currentUser } = useAuth();
  const { metrics, heatmapYear, heatmapMobile, recentLogs, goals, activity, profile } =
    dashboard;

  const displayName =
    currentUser?.display_name ?? profile?.display_name ?? "there";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar with brand + streak + primary action */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2.5 sm:px-4 lg:hidden">
        <Logo
          tone="dark"
          iconClassName="h-6 w-6 sm:h-7 sm:w-7"
          textClassName="text-base sm:text-lg"
        />
        <DashboardHeaderActions
          streak={metrics.currentStreak}
          className="flex lg:hidden"
        />
      </header>

      <div className="lg:flex">
        <DashboardSidebar user={currentUser ?? profile} />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
            <DashboardHeader
              greeting={dashboard.greeting}
              firstName={firstName}
              dateLine={dashboard.dateLine}
            >
              <DashboardHeaderActions
                streak={metrics.currentStreak}
                className="hidden lg:flex"
              />
            </DashboardHeader>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              <MetricCard
                icon={Flame}
                iconClassName="text-amber-500"
                label="Current streak"
                value={metrics.currentStreak}
                unit="days"
                unitClassName="text-amber-500"
                footnote={`Personal best: ${metrics.longestStreak} days`}
              />
              <MetricCard
                icon={CalendarCheck}
                iconClassName="text-green-600"
                label="Days logged this month"
                value={metrics.daysLoggedThisMonth}
                footnote={`of ${metrics.daysSoFarThisMonth} days so far`}
              />
              <MetricCard
                icon={Clock}
                iconClassName="text-teal-600"
                label="Hours this week"
                value={metrics.hoursThisWeek}
                unit="hrs"
                unitClassName="text-teal-600"
                footnote={metrics.hoursDeltaLabel}
              />
            </div>

            <div className="mt-4 space-y-4 lg:mt-6 lg:space-y-5">
              <DashboardCard
                title="Your contribution heatmap"
                action={<OnTrackBadge />}
              >
                <ContributionHeatmap
                  heatmap={heatmapMobile}
                  showRowLabels={false}
                  className="lg:hidden"
                />
                <ContributionHeatmap
                  heatmap={heatmapYear}
                  className="hidden lg:block"
                />
              </DashboardCard>

              <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
                <div className="lg:col-span-2">
                  <RecentLogCard
                    logs={recentLogs}
                    todayMinutes={metrics.todayMinutes}
                  />
                </div>
                <div className="space-y-4 lg:space-y-5">
                  <GoalsCard goals={goals} />
                  <ActivityCard days={activity} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default DashboardPage;

