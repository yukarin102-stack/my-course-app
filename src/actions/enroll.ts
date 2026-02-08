"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { enrollments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function enrollCourse(prevState: any, formData: FormData) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "ログインが必要です。" };
    }

    const courseId = formData.get("courseId") as string;
    if (!courseId) {
        return { error: "コースIDが不明です。" };
    }

    try {
        // In a real app, this would verify payment via Stripe/etc first

        // Check if ready enrolled
        // Note: Simple check logic omitted to keep it brief for demo, but DB unique constraints would catch it or we just add

        await db.insert(enrollments).values({
            userId: session.user.id,
            courseId: courseId,
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: "申し込み処理中にエラーが発生しました。" };
    }
}

export async function adminEnrollUser(userId: string, courseId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    // TODO: Add admin role check in production

    try {
        // Check if already enrolled
        const existing = await db.query.enrollments.findFirst({
            where: (enrollments, { and, eq }) => and(
                eq(enrollments.userId, userId),
                eq(enrollments.courseId, courseId)
            )
        });

        if (existing) {
            return { error: "既に登録済みです" };
        }

        await db.insert(enrollments).values({
            userId,
            courseId,
        });

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Admin enrollment error:", error);
        return { error: "登録中にエラーが発生しました" };
    }
}

export async function adminUnenrollUser(userId: string, courseId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    try {
        await db.delete(enrollments).where(
            and(
                eq(enrollments.userId, userId),
                eq(enrollments.courseId, courseId)
            )
        );

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Admin unenrollment error:", error);
        return { error: "登録解除中にエラーが発生しました" };
    }
}
