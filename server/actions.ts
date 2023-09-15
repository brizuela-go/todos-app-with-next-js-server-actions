"use server";

import { z } from "zod";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

const TodoSchema = z.object({
  title: z.string().min(3).max(20),
});

const addTodo = async (formData: FormData) => {
  const title = formData.get("title") as string;

  const validation = TodoSchema.safeParse({ title });

  if (!validation.success) {
    let errorMessage = "";

    validation.error.issues.forEach((issue) => {
      errorMessage += `${issue.path[0]}: ${issue.message}\n`;
    });

    throw new Error(errorMessage);
  }

  try {
    await prisma.todo.create({
      data: {
        title,
      },
    });
  } catch (e) {
    return {
      error: {
        message: "An error occurred while creating the todo.",
      },
    };
  } finally {
    revalidatePath("/");
  }
};

const deleteTodo = async (id: number) => {
  try {
    await prisma.todo.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    return {
      error: {
        message: "An error occurred while deleting the todo.",
      },
    };
  } finally {
    revalidatePath("/");
  }
};

const editTodo = async (id: number, title: string) => {
  const validation = TodoSchema.safeParse({ title });

  if (!validation.success) {
    let errorMessage = "";

    validation.error.issues.forEach((issue) => {
      errorMessage += `${issue.path[0]}: ${issue.message}\n`;
    });

    throw new Error(errorMessage);
  }

  try {
    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
  } catch (e) {
    return {
      error: {
        message: "An error occurred while editing the todo.",
      },
    };
  } finally {
    revalidatePath("/");
  }
};

export { addTodo, deleteTodo, editTodo };
