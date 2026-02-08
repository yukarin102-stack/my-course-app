"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { modules } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createModule(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    const courseId = formData.get("courseId") as string;
    const title = formData.get("title") as string;

    if (!courseId || !title) return { error: "入力が不足しています" };

    try {
        // Find highest order
        const existing = await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(desc(modules.order)).limit(1);
        const order = existing.length > 0 ? existing[0].order + 1 : 1;

        await db.insert(modules).values({
            courseId,
            title,
            order,
        });

        revalidatePath(`/admin/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "作成中にエラーが発生しました" };
    }
}

export async function deleteModule(moduleId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    try {
        const mod = await db.query.modules.findFirst({
            where: eq(modules.id, moduleId),
            columns: { courseId: true }
        });

        await db.delete(modules).where(eq(modules.id, moduleId));

        if (mod) revalidatePath(`/admin/courses/${mod.courseId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "削除中にエラーが発生しました" };
    }
}

export async function updateModule(moduleId: string, title: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    if (!title.trim()) return { error: "タイトルは必須です" };

    try {
        const mod = await db.query.modules.findFirst({
            where: eq(modules.id, moduleId),
            columns: { courseId: true }
        });

        await db.update(modules).set({ title: title.trim() }).where(eq(modules.id, moduleId));

        if (mod) revalidatePath(`/admin/courses/${mod.courseId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "更新中にエラーが発生しました" };
    }
}
