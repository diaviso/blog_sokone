import { getArticles } from "@/actions/articles";
import { ArticleCard } from "@/components/blog/article-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import type { Article } from "@/types";

export const metadata: Metadata = {
  title: "Search - Sacred Blog",
  description: "Search for articles on Sacred Blog",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const { articles } = q
    ? await getArticles({ published: true, search: q, limit: 50 })
    : { articles: [] };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Search Articles</h1>
        <form action="/blog/search" method="GET">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search for articles..."
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button type="submit" size="lg">
              Search
            </Button>
          </div>
        </form>
      </header>

      {q && (
        <div className="mb-8">
          <p className="text-muted-foreground">
            {articles.length} result{articles.length !== 1 ? "s" : ""} for &quot;{q}&quot;
          </p>
        </div>
      )}

      {q && articles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No articles found matching your search. Try different keywords.
        </p>
      ) : articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(articles as Article[]).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          Enter a search term to find articles.
        </p>
      )}
    </div>
  );
}
