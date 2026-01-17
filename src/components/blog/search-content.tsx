"use client";

import { ArticleCard } from "@/components/blog/article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { Article } from "@/types";

interface SearchContentProps {
  articles: Article[];
  query?: string;
}

export function SearchContent({ articles, query }: SearchContentProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {t("blog.searchArticles")}
        </h1>
        <form action="/blog/search" method="GET">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder={t("blog.searchPlaceholder")}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg">
              {t("common.search")}
            </Button>
          </div>
        </form>
      </header>

      {query && (
        <div className="mb-8">
          <p className="text-muted-foreground">
            {articles.length} {t("blog.resultsFor")} &quot;{query}&quot;
          </p>
        </div>
      )}

      {query && articles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {t("blog.noResultsFound")}
        </p>
      ) : articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          {t("blog.enterSearchTerm")}
        </p>
      )}
    </div>
  );
}
