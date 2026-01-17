"use client";

import { ArticleCard } from "@/components/blog/article-card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/context";
import type { Article } from "@/types";

interface CategoryContentProps {
  category: {
    name: string;
    description: string | null;
    color: string;
    articles: Article[];
  };
}

export function CategoryContent({ category }: CategoryContentProps) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <Badge
          className="mb-4 text-lg px-4 py-1"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          {category.name}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {category.description}
          </p>
        )}
        <p className="text-muted-foreground mt-4">
          {category.articles.length} {category.articles.length === 1 ? t("blog.article") : t("blog.articles")}
        </p>
      </header>

      {category.articles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {t("blog.noArticlesInCategory")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {category.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
