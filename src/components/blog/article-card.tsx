import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import { formatDate, truncate, stripHtml } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const excerpt = article.excerpt || truncate(stripHtml(article.content), 150);
  
  const mainImage = article.images?.find((img) => img.isMain)?.url 
    || article.images?.[0]?.url 
    || article.featuredImage;

  if (featured) {
    return (
      <Card className="overflow-hidden group animate-slide-up gradient-border rounded-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-auto image-zoom">
            {mainImage ? (
              <img
                src={mainImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl opacity-20 animate-float">📖</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <CardContent className="p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
            {article.category && (
              <Link href={`/blog/category/${article.category.slug}`}>
                <Badge
                  className="w-fit mb-4 hover:scale-105 transition-transform duration-300"
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors line-clamp-2 group-hover:translate-x-1 transition-transform duration-300">
                {article.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mb-6 line-clamp-3">{excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
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
            <Link 
              href={`/blog/${article.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-primary font-medium group/link"
            >
              Lire l&apos;article
              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-2 transition-transform duration-300" />
            </Link>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-3d overflow-hidden group hover-lift rounded-xl">
      <div className="card-3d-inner">
        <div className="relative aspect-video image-zoom">
          {mainImage ? (
            <img
              src={mainImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">📖</span>
            </div>
          )}
          {article.category && (
            <Link
              href={`/blog/category/${article.category.slug}`}
              className="absolute top-4 left-4 z-10"
            >
              <Badge
                className="shadow-lg hover:scale-105 transition-transform duration-300 backdrop-blur-sm"
                style={{
                  backgroundColor: `${article.category.color}dd`,
                  color: "white",
                }}
              >
                {article.category.name}
              </Badge>
            </Link>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <Link 
              href={`/blog/${article.slug}`}
              className="inline-flex items-center gap-2 text-white text-sm font-medium"
            >
              Lire la suite
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <CardContent className="p-5 relative">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
          <Link href={`/blog/${article.slug}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2 group-hover:translate-x-1 transition-transform duration-300">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 ring-1 ring-border">
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
      </div>
    </Card>
  );
}
