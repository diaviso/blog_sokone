import { getArticleById } from "@/actions/articles";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, MessageSquare, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TagOnArticle } from "@/types";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {!article.published && (
        <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 py-2 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Mode prévisualisation - Cet article n&apos;est pas encore publié</span>
            </div>
            <Link href={`/admin/articles/${id}`}>
              <Button variant="secondary" size="sm">
                Retour à l&apos;édition
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            {article.category && (
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: `${article.category.color}15`,
                  color: article.category.color,
                }}
              >
                {article.category.name}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={article.author?.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {article.author?.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article.author?.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views} vues
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {article._count?.comments || 0} commentaires
                </span>
              </div>
            </div>
          </header>

          {(article.images && article.images.length > 0) ? (
            <div className="mb-8 space-y-4">
              {article.images.find((img) => img.isMain) && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={article.images.find((img) => img.isMain)?.url || article.images[0]?.url}
                    alt={article.images.find((img) => img.isMain)?.alt || article.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              {article.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {article.images.filter((img) => !img.isMain).map((image) => (
                    <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt || article.title}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : article.featuredImage && (
            <div className="relative aspect-video mb-8 rounded-xl overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none mb-12 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-border">
              {article.tags.map(({ tag }: TagOnArticle) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
