"use client";

import { ArticleCard } from "@/components/blog/article-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import type { Article, Category } from "@/types";

interface BlogHomeContentProps {
  articles: Article[];
  categories: Category[];
}

export function BlogHomeContent({ articles, categories }: BlogHomeContentProps) {
  const { t } = useLanguage();
  
  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1);

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("blog.welcome")} <span className="gradient-text">{t("blog.siteName")}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t("blog.tagline")}
              <br />
              {t("blog.joinUs")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featuredArticle && (
        <section className="container mx-auto px-4 -mt-8">
          <ArticleCard article={featuredArticle} featured />
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">{t("blog.recentArticles")}</h2>
        {recentArticles.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {t("blog.noArticlesYet")}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
