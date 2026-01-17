import { Header } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTags } from "@/actions/tags";
import { Plus, Edit, Tag as TagIcon, FileText, Hash } from "lucide-react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteTag } from "@/actions/tags";
import { TagDialog } from "@/components/admin/tag-dialog";
import type { Tag } from "@/types";

export default async function TagsPage() {
  const tags = await getTags();
  const totalArticles = (tags as Tag[]).reduce((sum, tag) => sum + (tag._count?.articles || 0), 0);

  return (
    <div className="min-h-screen">
      <Header
        title="Tags"
        description="Gérez les tags pour vos articles"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-200/50 dark:border-indigo-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Hash className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tags.length}</p>
                  <p className="text-sm text-muted-foreground">Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 dark:border-emerald-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalArticles}</p>
                  <p className="text-sm text-muted-foreground">Utilisations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-200/50 dark:border-violet-800/50 col-span-2 md:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <TagIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tags.length > 0 ? Math.round(totalArticles / tags.length * 10) / 10 : 0}</p>
                  <p className="text-sm text-muted-foreground">Moyenne/tag</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header with action */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tous les tags</h2>
          <TagDialog>
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-4 w-4" />
              Nouveau tag
            </Button>
          </TagDialog>
        </div>

        {/* Tags Grid */}
        {tags.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun tag</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier tag pour organiser vos articles
              </p>
              <TagDialog>
                <Button>Créer un tag</Button>
              </TagDialog>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(tags as Tag[]).map((tag) => (
              <Card 
                key={tag.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TagDialog tag={tag}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TagDialog>
                      <DeleteDialog
                        title="Supprimer le tag"
                        description={`Êtes-vous sûr de vouloir supprimer "${tag.name}" ? Ce tag sera retiré de tous les articles.`}
                        onDelete={async () => {
                          "use server";
                          return deleteTag(tag.id);
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{tag.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">/{tag.slug}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <Badge variant="secondary" className="text-xs">
                      {tag._count?.articles || 0} article{(tag._count?.articles || 0) !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
