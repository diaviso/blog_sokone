"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { userSchema, updateUserSchema, UserInput, UpdateUserInput } from "@/lib/validations";
import { hash } from "bcryptjs";

export async function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function createUser(data: UserInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = userSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const existingUser = await db.user.findUnique({
    where: { email: validatedFields.data.email },
  });

  if (existingUser) {
    return { error: "A user with this email already exists" };
  }

  try {
    const hashedPassword = await hash(validatedFields.data.password, 12);

    const user = await db.user.create({
      data: {
        ...validatedFields.data,
        password: hashedPassword,
      },
    });

    revalidatePath("/admin/admins");
    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create administrator" };
  }
}

export async function updateUser(data: UpdateUserInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = updateUserSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { id, password, ...updateData } = validatedFields.data;

  if (updateData.email) {
    const emailConflict = await db.user.findFirst({
      where: { email: updateData.email, NOT: { id } },
    });

    if (emailConflict) {
      return { error: "A user with this email already exists" };
    }
  }

  try {
    const dataToUpdate: Record<string, unknown> = { ...updateData };
    
    if (password) {
      dataToUpdate.password = await hash(password, 12);
    }

    const user = await db.user.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/admins");
    return { success: true, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update administrator" };
  }
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (session.user.id === id) {
    return { error: "You cannot delete your own account" };
  }

  const userCount = await db.user.count();
  if (userCount <= 1) {
    return { error: "Cannot delete the last administrator" };
  }

  try {
    await db.user.delete({ where: { id } });
    revalidatePath("/admin/admins");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete administrator" };
  }
}
