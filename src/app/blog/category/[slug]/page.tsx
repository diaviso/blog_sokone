import { getCategoryBySlug } from "@/actions/categories";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog/article-card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import type { Article } from "@/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} - Sacred Blog`,
    description: category.description || `Articles in ${category.name} category`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

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
          {category.articles.length} article{category.articles.length !== 1 ? "s" : ""}
        </p>
      </header>

      {category.articles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No articles in this category yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(category.articles as Article[]).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
