"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { commentSchema, CommentInput } from "@/lib/validations";

export async function getComments(options?: {
  approved?: boolean;
  articleId?: string;
  page?: number;
  limit?: number;
}) {
  const { approved, articleId, page = 1, limit = 20 } = options || {};

  const where = {
    ...(approved !== undefined && { approved }),
    ...(articleId && { articleId }),
  };

  const [comments, total] = await Promise.all([
    db.comment.findMany({
      where,
      include: {
        article: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.comment.count({ where }),
  ]);

  return {
    comments,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function createComment(data: CommentInput) {
  const validatedFields = commentSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const article = await db.article.findUnique({
    where: { id: validatedFields.data.articleId },
  });

  if (!article || !article.published) {
    return { error: "Article not found" };
  }

  try {
    const comment = await db.comment.create({
      data: {
        ...validatedFields.data,
        approved: true,
      },
    });

    revalidatePath(`/blog/${article.slug}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to submit comment" };
  }
}

export async function approveComment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const comment = await db.comment.update({
      where: { id },
      data: { approved: true },
      include: { article: { select: { slug: true } } },
    });

    revalidatePath("/admin/comments");
    revalidatePath(`/blog/${comment.article.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error approving comment:", error);
    return { error: "Failed to approve comment" };
  }
}

export async function rejectComment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const comment = await db.comment.update({
      where: { id },
      data: { approved: false },
      include: { article: { select: { slug: true } } },
    });

    revalidatePath("/admin/comments");
    revalidatePath(`/blog/${comment.article.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error rejecting comment:", error);
    return { error: "Failed to reject comment" };
  }
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const comment = await db.comment.delete({
      where: { id },
      include: { article: { select: { slug: true } } },
    });

    revalidatePath("/admin/comments");
    revalidatePath(`/blog/${comment.article.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}
