import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/actions/categories";
import { Plus, Edit } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteCategory } from "@/actions/categories";
import { CategoryDialog } from "@/components/admin/category-dialog";
import type { Category } from "@/types";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      <Header
        title="Categories"
        description="Organize your articles with categories"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="text-sm">
            {categories.length} categories
          </Badge>
          <CategoryDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </CategoryDialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-lg border border-border bg-card">
              <p className="text-muted-foreground mb-4">
                No categories yet. Create your first category.
              </p>
              <CategoryDialog>
                <Button>Create Category</Button>
              </CategoryDialog>
            </div>
          ) : (
            (categories as Category[]).map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        /{category.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <CategoryDialog category={category}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CategoryDialog>
                    <DeleteDialog
                      title="Delete Category"
                      description={`Are you sure you want to delete "${category.name}"? Articles in this category will be uncategorized.`}
                      onDelete={async () => {
                        "use server";
                        return deleteCategory(category.id);
                      }}
                    />
                  </div>
                </div>
                {category.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {category._count?.articles || 0} articles
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
