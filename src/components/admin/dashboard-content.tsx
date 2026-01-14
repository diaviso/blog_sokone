"use client";

import { StatsCard } from "@/components/admin/stats-card";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import {
  FileText,
  Eye,
  MessageSquare,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/format";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import type { DashboardArticle, DashboardComment } from "@/types";

interface DashboardContentProps {
  stats: {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalViews: number;
    totalComments: number;
    pendingComments: number;
    approvedComments: number;
    totalCategories: number;
    totalTags: number;
  };
  recentArticles: DashboardArticle[];
  recentComments: DashboardComment[];
  articlesByMonth: { month: string; count: number }[];
  viewsByMonth: { month: string; views: number }[];
}

export function DashboardContent({
  stats,
  recentArticles,
  recentComments,
  articlesByMonth,
  viewsByMonth,
}: DashboardContentProps) {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalArticles")}
          value={stats.totalArticles}
          description={`${stats.publishedArticles} ${t("dashboard.publishedDrafts").replace("{drafts}", String(stats.draftArticles))}`}
          icon={FileText}
        />
        <StatsCard
          title={t("dashboard.totalViews")}
          value={stats.totalViews.toLocaleString()}
          description={t("dashboard.allTimeViews")}
          icon={Eye}
        />
        <StatsCard
          title={t("dashboard.comments")}
          value={stats.totalComments}
          description={`${stats.pendingComments} ${t("dashboard.pendingModeration")}`}
          icon={MessageSquare}
        />
        <StatsCard
          title={t("dashboard.categoriesTags")}
          value={`${stats.totalCategories} / ${stats.totalTags}`}
          description="Categories / Tags"
          icon={FolderOpen}
        />
      </div>

      <DashboardCharts
        stats={stats}
        articlesByMonth={articlesByMonth}
        viewsByMonth={viewsByMonth}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.recentArticles")}
            </CardTitle>
            <Link
              href="/admin/articles"
              className="text-sm text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t("dashboard.noArticlesYet")}
                </p>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {t("dashboard.by")} {article.author.name}
                        </span>
                        {article.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${article.category.color}20`,
                              color: article.category.color,
                            }}
                          >
                            {article.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {article.published ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(article.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.pendingComments")}
            </CardTitle>
            <Link
              href="/admin/comments"
              className="text-sm text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t("dashboard.noPendingComments")}
                </p>
              ) : (
                recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-medium">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t("dashboard.on")}{" "}
                            <Link
                              href={`/blog/${comment.article.slug}`}
                              className="hover:text-primary"
                            >
                              {comment.article.title}
                            </Link>
                          </span>
                        </div>
                      </div>
                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
