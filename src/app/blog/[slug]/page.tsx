import { getArticleBySlug, incrementArticleViews } from "@/actions/articles";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Eye, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { CommentSection } from "@/components/blog/comment-section";
import Link from "next/link";
import type { Metadata } from "next";
import type { TagOnArticle } from "@/types";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      type: "article",
      images: article.ogImage || article.featuredImage
        ? [{ url: article.ogImage || article.featuredImage || "" }]
        : undefined,
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author?.name ? [article.author.name] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  await incrementArticleViews(slug);

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          {article.category && (
            <Link href={`/blog/category/${article.category.slug}`}>
              <Badge
                className="mb-4"
                style={{
                  backgroundColor: `${article.category.color}15`,
                  color: article.category.color,
                }}
              >
                {article.category.name}
              </Badge>
            </Link>
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
                {article.views} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {article.comments?.length || 0} comments
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
          className="prose max-w-none mb-12"
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

        <CommentSection
          articleId={article.id}
          comments={article.comments || []}
        />
      </div>
    </article>
  );
}
