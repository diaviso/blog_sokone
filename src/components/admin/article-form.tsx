"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ArticleImages } from "@/components/admin/article-images";
import { createArticle, updateArticle, generateSlug } from "@/actions/articles";
import { toast } from "sonner";
import { Save, Eye, Loader2, X } from "lucide-react";
import type { Article, Category, Tag, ArticleImage } from "@/types";

interface ArticleFormProps {
  article?: Article | null;
  categories: Category[];
  tags: Tag[];
}

export function ArticleForm({ article, categories, tags }: ArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage || "");
  const [published, setPublished] = useState(article?.published || false);
  const [categoryId, setCategoryId] = useState(article?.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags?.map((t) => t.tagId) || []
  );
  const [metaTitle, setMetaTitle] = useState(article?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(article?.metaDescription || "");
  const [ogImage, setOgImage] = useState(article?.ogImage || "");
  const [images, setImages] = useState<ArticleImage[]>(article?.images || []);

  useEffect(() => {
    if (!article && title && !slug) {
      const generateSlugFromTitle = async () => {
        const newSlug = await generateSlug(title);
        setSlug(newSlug);
      };
      const timeoutId = setTimeout(generateSlugFromTitle, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [title, article, slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const data = {
        title,
        slug,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        published,
        categoryId: categoryId || null,
        tagIds: selectedTags,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        ogImage: ogImage || undefined,
      };

      const result = article
        ? await updateArticle(article.id, data)
        : await createArticle(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(article ? "Article updated" : "Article created");
        router.push("/admin/articles");
      }
    });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published" className="font-medium">
              {published ? "Publié" : "Brouillon"}
            </Label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {article && (
            <a href={`/admin/articles/${article.id}/preview`} target="_blank" rel="noopener">
              <Button type="button" variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Prévisualiser
              </Button>
            </a>
          )}
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {article ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entrez le titre de l'article"
                  className="text-lg font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brève description de l'article"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Contenu</Label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={categoryId || "none"} 
                  onValueChange={(value) => setCategoryId(value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune catégorie</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.id) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucun tag disponible</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">URL de l'image à la une</Label>
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {article && (
            <ArticleImages
              articleId={article.id}
              images={images}
              onImagesChange={setImages}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">
                  Titre Meta
                  <span className="text-muted-foreground ml-2 text-xs">
                    ({metaTitle.length}/70)
                  </span>
                </Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Titre SEO"
                  maxLength={70}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">
                  Description Meta
                  <span className="text-muted-foreground ml-2 text-xs">
                    ({metaDescription.length}/160)
                  </span>
                </Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Description SEO"
                  rows={3}
                  maxLength={160}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">URL de l'image Open Graph</Label>
                <Input
                  id="ogImage"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
