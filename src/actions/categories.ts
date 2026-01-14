"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { categorySchema, CategoryInput } from "@/lib/validations";

export async function getCategories() {
  return db.category.findMany({
    include: {
      _count: { select: { articles: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { published: true },
        include: {
          author: { select: { id: true, name: true, image: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });
}

export async function createCategory(data: CategoryInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = categorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const existingSlug = await db.category.findUnique({
    where: { slug: validatedFields.data.slug },
  });

  if (existingSlug) {
    return { error: "A category with this slug already exists" };
  }

  try {
    const category = await db.category.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = categorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const slugConflict = await db.category.findFirst({
    where: { slug: validatedFields.data.slug, NOT: { id } },
  });

  if (slugConflict) {
    return { error: "A category with this slug already exists" };
  }

  try {
    const category = await db.category.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}
