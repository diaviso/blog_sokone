import { getArticles, deleteArticle } from "@/actions/articles";
import { getCategories } from "@/actions/categories";
import { ArticlesList } from "@/components/admin/articles-list";
import type { Article, Category } from "@/types";

export default async function ArticlesPage() {
  const [{ articles, total }, categories] = await Promise.all([
    getArticles({ limit: 100 }),
    getCategories(),
  ]);

  return (
    <ArticlesList
      articles={articles as Article[]}
      categories={categories as Category[]}
      total={total}
      onDeleteArticle={deleteArticle}
    />
  );
}
