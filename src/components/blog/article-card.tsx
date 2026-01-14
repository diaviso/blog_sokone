import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye } from "lucide-react";
import { formatDate, truncate, stripHtml } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const excerpt = article.excerpt || truncate(stripHtml(article.content), 150);

  if (featured) {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-auto">
            {article.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl opacity-20">📖</span>
              </div>
            )}
          </div>
          <CardContent className="p-8 flex flex-col justify-center">
            {article.category && (
              <Link href={`/blog/category/${article.category.slug}`}>
                <Badge
                  className="w-fit mb-4"
                  style={{
                    backgroundColor: `${article.category.color}15`,
                    color: article.category.color,
                  }}
                >
                  {article.category.name}
                </Badge>
              </Link>
            )}
            <Link href={`/blog/${article.slug}`}>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mb-6 line-clamp-3">{excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={article.author?.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {article.author?.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{article.author?.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-video">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl opacity-20">📖</span>
          </div>
        )}
        {article.category && (
          <Link
            href={`/blog/category/${article.category.slug}`}
            className="absolute top-4 left-4"
          >
            <Badge
              style={{
                backgroundColor: article.category.color,
                color: "white",
              }}
            >
              {article.category.name}
            </Badge>
          </Link>
        )}
      </div>
      <CardContent className="p-5">
        <Link href={`/blog/${article.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={article.author?.image || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {article.author?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <span>{article.author?.name}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
