"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const courseSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "価格は0以上である必要があります"),
    published: z.coerce.boolean(),
    thumbnailUrl: z.string().optional(),
});

export async function createCourse(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    const validatedFields = courseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description")?.toString(),
        price: formData.get("price"),
        published: formData.get("published") === "on",
        thumbnailUrl: formData.get("thumbnailUrl")?.toString(),
    });

    if (!validatedFields.success) {
        console.error("Validation Error:", validatedFields.error);
        return { error: "入力内容を確認してください" };
    }

    try {
        const [newCourse] = await db.insert(courses).values({
            title: validatedFields.data.title,
            description: validatedFields.data.description,
            price: validatedFields.data.price,
            published: validatedFields.data.published,
            thumbnailUrl: validatedFields.data.thumbnailUrl,
        }).returning();

        revalidatePath("/admin/courses");
        return { success: true, courseId: newCourse.id };
    } catch (error) {
        console.error(error);
        return { error: "作成中にエラーが発生しました" };
    }
}

export async function updateCourse(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    const validatedFields = courseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        published: formData.get("published") === "on",
        thumbnailUrl: formData.get("thumbnailUrl"),
    });

    if (!validatedFields.success) {
        return { error: "入力内容を確認してください" };
    }

    try {
        await db.update(courses)
            .set({
                title: validatedFields.data.title,
                description: validatedFields.data.description,
                price: validatedFields.data.price,
                published: validatedFields.data.published,
                thumbnailUrl: validatedFields.data.thumbnailUrl,
                updatedAt: new Date(),
            })
            .where(eq(courses.id, id));

        revalidatePath("/admin/courses");
        revalidatePath(`/admin/courses/${id}`);
        revalidatePath(`/courses/${id}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "更新中にエラーが発生しました" };
    }
}

export async function deleteCourse(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "権限がありません" };

    try {
        await db.delete(courses).where(eq(courses.id, id));
        revalidatePath("/admin/courses");
        return { success: true };
    } catch (error) {
        console.error("Delete course error:", error);
        return { error: "削除中にエラーが発生しました" };
    }
}
