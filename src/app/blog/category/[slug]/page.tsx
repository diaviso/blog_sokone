import { getCategoryBySlug } from "@/actions/categories";
import { notFound } from "next/navigation";
import { CategoryContent } from "@/components/blog/category-content";
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
    return { title: "Catégorie non trouvée" };
  }

  return {
    title: `${category.name} - Sacred Blog`,
    description: category.description || `Articles dans la catégorie ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <CategoryContent
      category={{
        ...category,
        articles: category.articles as Article[],
      }}
    />
  );
}
