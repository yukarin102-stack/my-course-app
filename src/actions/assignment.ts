"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { submissions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function submitAssignment(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "ログインが必要です" };

    const lessonId = formData.get("lessonId") as string;
    const courseId = formData.get("courseId") as string;
    const content = formData.get("content") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!lessonId) return { error: "レッスンIDが不足しています" };
    if (!content && !fileUrl) return { error: "提出内容またはURLを入力してください" };

    try {
        // Check if submission already exists
        const existing = await db.select().from(submissions)
            .where(and(eq(submissions.userId, session.user.id), eq(submissions.lessonId, lessonId)))
            .get();

        if (existing) {
            await db.update(submissions).set({
                content,
                fileUrl,
                status: "submitted",
                updatedAt: new Date(),
            }).where(eq(submissions.id, existing.id));
        } else {
            await db.insert(submissions).values({
                userId: session.user.id,
                lessonId,
                content,
                fileUrl,
                status: "submitted",
            });
        }

        revalidatePath(`/courses/${courseId}/learn`);
        return { success: true };
    } catch (error) {
        console.error("Submission failed:", error);
        return { error: "提出に失敗しました" };
    }
}

export async function gradeSubmission(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    const submissionId = formData.get("submissionId") as string;
    const gradeStr = formData.get("grade") as string;
    const feedback = formData.get("feedback") as string;

    if (!submissionId || !feedback) return { error: "入力内容が不足しています" };

    try {
        await db.update(submissions).set({
            grade: gradeStr ? parseInt(gradeStr) : null,
            feedback,
            status: "graded",
            updatedAt: new Date(),
        }).where(eq(submissions.id, submissionId));

        // Revalidate the submission page in admin
        // Note: Dynamic routes like [lessonId] might need specific path or wildcard
        revalidatePath(`/admin/courses`);
        return { success: true };
    } catch (error) {
        console.error("Grading failed:", error);
        return { error: "保存に失敗しました" };
    }
}
