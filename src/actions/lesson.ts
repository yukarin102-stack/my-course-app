"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { lessons, modules, quizQuestions, quizOptions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const lessonSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    type: z.enum(["video", "text", "quiz", "live", "assignment"]),
    videoUrl: z.string().optional(),
    description: z.string().optional(),
    moduleId: z.string().min(1),
    courseId: z.string().min(1),
});

export async function createLesson(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    const parsed = lessonSchema.safeParse({
        title: formData.get("title"),
        type: formData.get("type"),
        videoUrl: formData.get("videoUrl"),
        description: formData.get("description"),
        moduleId: formData.get("moduleId"),
        courseId: formData.get("courseId"),
    });

    if (!parsed.success) {
        return { error: "入力内容を確認してください" };
    }

    try {
        // Find highest order
        const existing = await db.select().from(lessons)
            .where(eq(lessons.moduleId, parsed.data.moduleId))
            .orderBy(desc(lessons.order));

        const order = existing.length > 0 ? existing[0].order + 1 : 1;

        await db.insert(lessons).values({
            title: parsed.data.title,
            type: parsed.data.type,
            videoUrl: parsed.data.videoUrl,
            description: parsed.data.description,
            moduleId: parsed.data.moduleId,
            order,
        });

        revalidatePath(`/admin/courses/${parsed.data.courseId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "作成中にエラーが発生しました" };
    }
}

export async function updateLesson(lessonId: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user) {
        return { error: "権限がありません" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const order = parseInt(formData.get("order") as string);
    const isFree = formData.get("isFree") === "on";
    const type = formData.get("type") as string;

    if (!title) {
        return { error: "タイトルは必須です" };
    }

    try {
        await db.update(lessons)
            .set({
                title,
                description: description || null,
                videoUrl: videoUrl || null,
                order,
                isFree,
                type: type as any,
            })
            .where(eq(lessons.id, lessonId));

        revalidatePath(`/admin/courses`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "更新に失敗しました" };
    }
}

export async function updateQuizQuestions(lessonId: string, questionsData: any[]) {
    const session = await auth();
    if (!session?.user) {
        return { error: "権限がありません" };
    }

    try {
        // Delete existing questions and options (cascade will handle options)
        await db.delete(quizQuestions).where(eq(quizQuestions.lessonId, lessonId));

        // Insert new questions
        for (const q of questionsData) {
            const [insertedQuestion] = await db.insert(quizQuestions).values({
                lessonId,
                questionText: q.questionText,
                order: q.order,
            }).returning();

            // Insert options
            for (const opt of q.options) {
                await db.insert(quizOptions).values({
                    questionId: insertedQuestion.id,
                    optionText: opt.optionText,
                    isCorrect: opt.isCorrect,
                    order: opt.order,
                });
            }
        }

        revalidatePath(`/admin/courses`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "クイズの更新に失敗しました" };
    }
}
