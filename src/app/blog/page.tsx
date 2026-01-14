import { getArticles } from "@/actions/articles";
import { getCategories } from "@/actions/categories";
import { BlogHomeContent } from "@/components/blog/blog-home-content";
import type { Metadata } from "next";
import type { Article, Category } from "@/types";

export const metadata: Metadata = {
  title: "Sacred Blog - Réflexions Spirituelles & Actualités",
  description: "Un espace de réflexion spirituelle, d'actualités communautaires et d'enseignements religieux. Rejoignez-nous dans notre voyage de foi et de découverte.",
  openGraph: {
    title: "Sacred Blog - Réflexions Spirituelles & Actualités",
    description: "Un espace de réflexion spirituelle, d'actualités communautaires et d'enseignements religieux.",
    type: "website",
  },
};

export default async function BlogHomePage() {
  const [{ articles }, categories] = await Promise.all([
    getArticles({ published: true, limit: 12 }),
    getCategories(),
  ]);

  return (
    <BlogHomeContent 
      articles={articles as Article[]} 
      categories={categories as Category[]} 
    />
  );
}
