import { getArticles } from "@/actions/articles";
import { SearchContent } from "@/components/blog/search-content";
import type { Metadata } from "next";
import type { Article } from "@/types";

export const metadata: Metadata = {
  title: "Recherche - Sacred Blog",
  description: "Rechercher des articles sur Sacred Blog",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const { articles } = q
    ? await getArticles({ published: true, search: q, limit: 50 })
    : { articles: [] };

  return <SearchContent articles={articles as Article[]} query={q} />;
}
