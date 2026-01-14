"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { articleSchema, ArticleInput } from "@/lib/validations";
import { slugify } from "@/lib/utils/slugify";

export async function getArticles(options?: {
  published?: boolean;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { published, categoryId, search, page = 1, limit = 10 } = options || {};

  const where = {
    ...(published !== undefined && { published }),
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { content: { contains: search, mode: "insensitive" as const } },
        { excerpt: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [articles, total] = await Promise.all([
    db.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.article.count({ where }),
  ]);

  return {
    articles,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
      tags: { include: { tag: true } },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getArticleById(id: string) {
  return db.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true, color: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createArticle(data: ArticleInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = articleSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { tagIds, ...articleData } = validatedFields.data;

  const existingSlug = await db.article.findUnique({
    where: { slug: articleData.slug },
  });

  if (existingSlug) {
    return { error: "An article with this slug already exists" };
  }

  try {
    const article = await db.article.create({
      data: {
        ...articleData,
        authorId: session.user.id,
        publishedAt: articleData.published ? new Date() : null,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });

    revalidatePath("/admin/articles");
    revalidatePath("/blog");
    return { success: true, article };
  } catch (error) {
    console.error("Error creating article:", error);
    return { error: "Failed to create article" };
  }
}

export async function updateArticle(id: string, data: ArticleInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = articleSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { tagIds, ...articleData } = validatedFields.data;

  const existingArticle = await db.article.findUnique({ where: { id } });
  if (!existingArticle) {
    return { error: "Article not found" };
  }

  const slugConflict = await db.article.findFirst({
    where: { slug: articleData.slug, NOT: { id } },
  });

  if (slugConflict) {
    return { error: "An article with this slug already exists" };
  }

  try {
    await db.tagsOnArticles.deleteMany({ where: { articleId: id } });

    const article = await db.article.update({
      where: { id },
      data: {
        ...articleData,
        publishedAt:
          articleData.published && !existingArticle.publishedAt
            ? new Date()
            : existingArticle.publishedAt,
        tags: {
          create: tagIds.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });

    revalidatePath("/admin/articles");
    revalidatePath(`/blog/${article.slug}`);
    revalidatePath("/blog");
    return { success: true, article };
  } catch (error) {
    console.error("Error updating article:", error);
    return { error: "Failed to update article" };
  }
}

export async function deleteArticle(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.article.delete({ where: { id } });
    revalidatePath("/admin/articles");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting article:", error);
    return { error: "Failed to delete article" };
  }
}

export async function toggleArticlePublished(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const article = await db.article.findUnique({ where: { id } });
  if (!article) {
    return { error: "Article not found" };
  }

  try {
    const updated = await db.article.update({
      where: { id },
      data: {
        published: !article.published,
        publishedAt: !article.published ? new Date() : article.publishedAt,
      },
    });

    revalidatePath("/admin/articles");
    revalidatePath("/blog");
    return { success: true, published: updated.published };
  } catch (error) {
    console.error("Error toggling article:", error);
    return { error: "Failed to update article" };
  }
}

export async function incrementArticleViews(slug: string) {
  try {
    await db.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function generateSlug(title: string) {
  return slugify(title);
}
