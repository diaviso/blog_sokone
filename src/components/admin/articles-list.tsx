"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { useLanguage } from "@/lib/i18n/context";
import { Header } from "@/components/admin/header";
import type { Article } from "@/types";

interface ArticlesListProps {
  articles: Article[];
  total: number;
  onDeleteArticle: (id: string) => Promise<{ error?: string }>;
}

export function ArticlesList({ articles, total, onDeleteArticle }: ArticlesListProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header
        titleKey="articles.title"
        descriptionKey="articles.description"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {total} {total === 1 ? t("blog.article") : t("blog.articles")}
            </Badge>
          </div>
          <Link href="/admin/articles/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("articles.newArticle")}
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {articles.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                {t("dashboard.noArticlesYet")}
              </p>
              <Link href="/admin/articles/new">
                <Button>{t("articles.createArticle")}</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium truncate">{article.title}</h3>
                      {article.published ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t("articles.published")}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {t("articles.draft")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{t("articles.by")} {article.author?.name}</span>
                      {article.category && (
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: article.category.color,
                            color: article.category.color,
                          }}
                        >
                          {article.category.name}
                        </Badge>
                      )}
                      <span>{formatRelativeTime(article.createdAt)}</span>
                      <span>{article.views} {t("articles.views")}</span>
                      <span>{article._count?.comments || 0} {t("articles.comments")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${article.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/articles/${article.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteDialog
                      title={t("common.delete")}
                      description={t("articles.deleteConfirm")}
                      onDelete={() => onDeleteArticle(article.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
