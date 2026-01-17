"use client";

import { ArticleCard } from "@/components/blog/article-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";
import { BookOpen } from "lucide-react";
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
    <div className="overflow-hidden">
      {/* Hero Section with animated background */}
      <section className="relative py-24 bg-gradient-to-b from-[#006400]/10 via-background to-background overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#006400]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-[#006400]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#C0A060]/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6 animate-slide-up">
              <Image 
                src="/image.png" 
                alt="Khidmatoul Quran" 
                width={120} 
                height={120}
                className="h-28 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-slide-up text-[#006400]" style={{ animationDelay: '0.1s' }}>
              {t("blog.siteName")}
            </h1>
            <p className="text-lg text-[#C0A060] font-medium mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              {t("blog.subtitle")}
            </p>
            <p className="text-xl text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {t("blog.tagline")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {categories.map((category, index) => (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="text-sm px-5 py-2 cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      animationDelay: `${0.4 + index * 0.1}s`,
                    }}
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="container mx-auto px-4 -mt-12 relative z-20">
          <ArticleCard article={featuredArticle} featured />
        </section>
      )}

      {/* Recent Articles */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
          <h2 className="text-3xl font-bold">{t("blog.recentArticles")}</h2>
        </div>
        {recentArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-xl text-muted-foreground">
              {t("blog.noArticlesYet")}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-children">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
