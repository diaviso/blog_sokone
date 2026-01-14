import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTags } from "@/actions/tags";
import { Plus, Edit } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteTag } from "@/actions/tags";
import { TagDialog } from "@/components/admin/tag-dialog";
import type { Tag } from "@/types";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="min-h-screen">
      <Header
        title="Tags"
        description="Manage tags for your articles"
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="text-sm">
            {tags.length} tags
          </Badge>
          <TagDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Tag
            </Button>
          </TagDialog>
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-card">
          {tags.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No tags yet. Create your first tag.
              </p>
              <TagDialog>
                <Button>Create Tag</Button>
              </TagDialog>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(tags as Tag[]).map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm">
                      {tag.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      /{tag.slug}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tag._count?.articles || 0} articles
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TagDialog tag={tag}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TagDialog>
                    <DeleteDialog
                      title="Delete Tag"
                      description={`Are you sure you want to delete "${tag.name}"? This tag will be removed from all articles.`}
                      onDelete={async () => {
                        "use server";
                        return deleteTag(tag.id);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
