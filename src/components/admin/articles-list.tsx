"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Eye, CheckCircle, Clock, Search, Filter, Calendar, MessageSquare, BarChart3, Image } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime, formatDate } from "@/lib/utils/format";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { Header } from "@/components/admin/header";
import type { Article, Category } from "@/types";

interface ArticlesListProps {
  articles: Article[];
  categories: Category[];
  total: number;
  onDeleteArticle: (id: string) => Promise<{ error?: string }>;
}

export function ArticlesList({ articles, categories, total, onDeleteArticle }: ArticlesListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = search === "" || 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "published" && article.published) ||
        (statusFilter === "draft" && !article.published);
      
      const matchesCategory = categoryFilter === "all" || 
        article.categoryId === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, search, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const published = articles.filter(a => a.published).length;
    const drafts = articles.filter(a => !a.published).length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalComments = articles.reduce((sum, a) => sum + (a._count?.comments || 0), 0);
    return { published, drafts, totalViews, totalComments };
  }, [articles]);

  return (
    <div className="min-h-screen">
      <Header
        titleKey="articles.title"
        descriptionKey="articles.description"
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.published}</p>
                  <p className="text-sm text-muted-foreground">Publiés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/50 dark:border-amber-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.drafts}</p>
                  <p className="text-sm text-muted-foreground">Brouillons</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalComments}</p>
                  <p className="text-sm text-muted-foreground">Commentaires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="published">Publiés</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Link href="/admin/articles/new">
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-4 w-4" />
              Nouvel article
            </Button>
          </Link>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} trouvé{filteredArticles.length !== 1 ? 's' : ''}</span>
          {(search || statusFilter !== "all" || categoryFilter !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); }}
              className="h-auto py-1 px-2 text-xs"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {search || statusFilter !== "all" || categoryFilter !== "all" 
                  ? "Essayez de modifier vos filtres de recherche"
                  : "Commencez par créer votre premier article"}
              </p>
              {!search && statusFilter === "all" && categoryFilter === "all" && (
                <Link href="/admin/articles/new">
                  <Button>Créer un article</Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {article.featuredImage || article.images?.[0]?.url ? (
                    <img
                      src={article.images?.find(i => i.isMain)?.url || article.images?.[0]?.url || article.featuredImage || ''}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Image className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {article.published ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Publié
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">
                        <Clock className="h-3 w-3 mr-1" />
                        Brouillon
                      </Badge>
                    )}
                  </div>
                  {/* Category Badge */}
                  {article.category && (
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className="shadow-lg"
                        style={{ 
                          backgroundColor: article.category.color,
                          color: 'white'
                        }}
                      >
                        {article.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {article._count?.comments || 0}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <span className="text-sm text-muted-foreground">{article.author?.name}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/articles/${article.id}/preview`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Prévisualiser">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifier">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteDialog
                        title="Supprimer"
                        description="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
                        onDelete={() => onDeleteArticle(article.id)}
                      />
                    </div>
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
