import { getDashboardStats } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { DashboardContent } from "@/components/admin/dashboard-content";
import type { DashboardArticle, DashboardComment } from "@/types";

export default async function DashboardPage() {
  const { stats, recentArticles, recentComments, articlesByMonth, viewsByMonth } = await getDashboardStats();

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <DashboardContent
        stats={stats}
        recentArticles={recentArticles as DashboardArticle[]}
        recentComments={recentComments as DashboardComment[]}
        articlesByMonth={articlesByMonth}
        viewsByMonth={viewsByMonth}
      />
    </div>
  );
}
