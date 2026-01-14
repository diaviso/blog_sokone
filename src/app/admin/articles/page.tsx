import { getArticles, deleteArticle } from "@/actions/articles";
import { ArticlesList } from "@/components/admin/articles-list";
import type { Article } from "@/types";

export default async function ArticlesPage() {
  const { articles, total } = await getArticles();

  return (
    <ArticlesList
      articles={articles as Article[]}
      total={total}
      onDeleteArticle={deleteArticle}
    />
  );
}
