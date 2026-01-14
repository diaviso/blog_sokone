import { Header } from "@/components/admin/header";
import { ArticleForm } from "@/components/admin/article-form";
import { getCategories } from "@/actions/categories";
import { getTags } from "@/actions/tags";
import { getArticleById } from "@/actions/articles";
import { notFound } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [article, categories, tags] = await Promise.all([
    getArticleById(id),
    getCategories(),
    getTags(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Edit Article"
        description={`Editing: ${article.title}`}
      />
      <div className="p-6">
        <ArticleForm article={article} categories={categories} tags={tags} />
      </div>
    </div>
  );
}
