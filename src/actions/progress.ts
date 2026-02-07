"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return;

    const lessonId = formData.get("lessonId") as string;
    const nextLessonId = formData.get("nextLessonId") as string;
    const courseId = formData.get("courseId") as string;

    if (!lessonId) return;

    // Upsert progress
    const existing = await db.select().from(progress)
        .where(and(eq(progress.userId, session.user.id), eq(progress.lessonId, lessonId)))
        .get();

    if (!existing) {
        await db.insert(progress).values({
            userId: session.user.id,
            lessonId,
            completed: true,
        });
    } else {
        // If already exists, ensure it's marked complete (if we wanted simple toggle, logic would differ)
        await db.update(progress).set({ completed: true }).where(eq(progress.id, existing.id));
    }

    revalidatePath(`/courses/${courseId}/learn`);

    if (nextLessonId) {
        redirect(`/courses/${courseId}/learn?lessonId=${nextLessonId}`);
    }
}
