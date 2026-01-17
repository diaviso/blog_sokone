"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addArticleImage, deleteArticleImage, setMainImage } from "@/actions/articles";
import { toast } from "sonner";
import { Plus, Trash2, Star, Loader2, ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import type { ArticleImage } from "@/types";

interface ArticleImagesProps {
  articleId: string;
  images: ArticleImage[];
  onImagesChange: (images: ArticleImage[]) => void;
}

export function ArticleImages({ articleId, images, onImagesChange }: ArticleImagesProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error("Veuillez entrer une URL d'image");
      return;
    }

    startTransition(async () => {
      const result = await addArticleImage(articleId, {
        url: newImageUrl,
        alt: newImageAlt || undefined,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.image) {
        toast.success("Image ajoutée");
        onImagesChange([...images, result.image as ArticleImage]);
        setNewImageUrl("");
        setNewImageAlt("");
      }
    });
  };

  const handleDeleteImage = (imageId: string) => {
    startTransition(async () => {
      const result = await deleteArticleImage(imageId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Image supprimée");
        const updatedImages = images.filter((img) => img.id !== imageId);
        if (images.find((img) => img.id === imageId)?.isMain && updatedImages.length > 0) {
          updatedImages[0].isMain = true;
        }
        onImagesChange(updatedImages);
      }
    });
  };

  const handleSetMainImage = (imageId: string) => {
    startTransition(async () => {
      const result = await setMainImage(imageId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Image principale définie");
        onImagesChange(
          images.map((img) => ({
            ...img,
            isMain: img.id === imageId,
          }))
        );
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Photos de l&apos;article
          <Badge variant="secondary" className="ml-2">
            {images.length}/3
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {images.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group rounded-lg overflow-hidden border border-border"
              >
                <img
                  src={image.url}
                  alt={image.alt || "Article image"}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isMain && (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => handleSetMainImage(image.id)}
                      disabled={isPending}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.isMain && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Principale
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length < 3 && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l&apos;image</Label>
              <Input
                id="imageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Texte alternatif (optionnel)</Label>
              <Input
                id="imageAlt"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Description de l'image"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddImage}
              disabled={isPending || !newImageUrl.trim()}
              className="w-full gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Ajouter une image
            </Button>
          </div>
        )}

        {images.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune image. Ajoutez jusqu&apos;à 3 photos pour cet article.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
