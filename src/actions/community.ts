"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts, comments } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const courseId = formData.get("courseId") as string;

    if (!title || !content || !courseId) {
        return { error: "入力内容が不足しています。" };
    }

    try {
        await db.insert(posts).values({
            userId: session.user.id,
            courseId,
            title,
            content,
        });

        revalidatePath(`/courses/${courseId}/community`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { error: "投稿の作成に失敗しました。" };
    }
}

export async function createComment(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const content = formData.get("content") as string;
    const postId = formData.get("postId") as string;
    const courseId = formData.get("courseId") as string;

    if (!content || !postId) {
        return { error: "入力内容が不足しています。" };
    }

    try {
        await db.insert(comments).values({
            userId: session.user.id,
            postId,
            content,
        });

        // Revalidate the specific post page and the list
        revalidatePath(`/courses/${courseId}/community/${postId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { error: "コメントの作成に失敗しました。" };
    }
}
