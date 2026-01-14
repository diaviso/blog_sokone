"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { tagSchema, TagInput } from "@/lib/validations";

export async function getTags() {
  return db.tag.findMany({
    include: {
      _count: { select: { articles: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function createTag(data: TagInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = tagSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const existingSlug = await db.tag.findUnique({
    where: { slug: validatedFields.data.slug },
  });

  if (existingSlug) {
    return { error: "A tag with this slug already exists" };
  }

  try {
    const tag = await db.tag.create({
      data: validatedFields.data,
    });

    revalidatePath("/admin/tags");
    return { success: true, tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { error: "Failed to create tag" };
  }
}

export async function updateTag(id: string, data: TagInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = tagSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const slugConflict = await db.tag.findFirst({
    where: { slug: validatedFields.data.slug, NOT: { id } },
  });

  if (slugConflict) {
    return { error: "A tag with this slug already exists" };
  }

  try {
    const tag = await db.tag.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath("/admin/tags");
    return { success: true, tag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { error: "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.tag.delete({ where: { id } });
    revalidatePath("/admin/tags");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { error: "Failed to delete tag" };
  }
}
