import { Header } from "@/components/admin/header";
import { ArticleForm } from "@/components/admin/article-form";
import { getCategories } from "@/actions/categories";
import { getTags } from "@/actions/tags";

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div className="min-h-screen">
      <Header
        title="New Article"
        description="Create a new blog article"
      />
      <div className="p-6">
        <ArticleForm categories={categories} tags={tags} />
      </div>
    </div>
  );
}
