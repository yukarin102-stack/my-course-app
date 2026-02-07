"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { announcements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    content: z.string().min(1, "本文は必須です"),
    videoUrl: z.string().optional(),
    courseId: z.string().min(1, "コースIDは必須です"),
});

export async function createCourseAnnouncement(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') return { error: "権限がありません" };

    const parsed = announcementSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
        videoUrl: formData.get("videoUrl"),
        courseId: formData.get("courseId"),
    });

    if (!parsed.success) {
        return { error: "入力内容を確認してください" };
    }

    try {
        await db.insert(announcements).values({
            title: parsed.data.title,
            content: parsed.data.content,
            videoUrl: parsed.data.videoUrl,
            courseId: parsed.data.courseId,
            published: true,
        });

        revalidatePath(`/admin/courses/${parsed.data.courseId}`);
        revalidatePath(`/courses/${parsed.data.courseId}/learn`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "作成中にエラーが発生しました" };
    }
}

export async function deleteAnnouncement(announcementId: string, courseId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') return { error: "権限がありません" };

    try {
        await db.delete(announcements).where(eq(announcements.id, announcementId));
        revalidatePath(`/admin/courses/${courseId}`);
        revalidatePath(`/courses/${courseId}/learn`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "削除中にエラーが発生しました" };
    }
}
