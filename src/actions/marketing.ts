"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { announcements, coupons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Announcements ---

const announcementSchema = z.object({
    title: z.string().min(1, "タイトルは必須です"),
    content: z.string().min(1, "内容は必須です"),
    published: z.coerce.boolean(),
});

export async function createAnnouncement(prevState: any, formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "admin") return { error: "権限がありません" };

    const parsed = announcementSchema.safeParse({
        title: formData.get("title"),
        content: formData.get("content"),
        published: formData.get("published"),
    });

    if (!parsed.success) {
        return { error: "入力内容を確認してください" };
    }

    try {
        await db.insert(announcements).values({
            title: parsed.data.title,
            content: parsed.data.content,
            published: parsed.data.published,
        });
        revalidatePath("/admin/announcements");
        return { success: true };
    } catch (err) {
        return { error: "エラーが発生しました" };
    }
}

export async function deleteAnnouncement(id: string) {
    const session = await auth();
    if (session?.user?.role !== "admin") return;

    await db.delete(announcements).where(eq(announcements.id, id));
    revalidatePath("/admin/announcements");
}

// --- Coupons ---

const couponSchema = z.object({
    code: z.string().min(3, "コードは3文字以上です").regex(/^[A-Za-z0-9]+$/, "英数字のみ使用できます"),
    discountAmount: z.coerce.number().min(1, "割引額は1円以上です"),
    maxUses: z.coerce.number().optional(),
    expiresAt: z.string().optional(),
});

export async function createCoupon(prevState: any, formData: FormData) {
    const session = await auth();
    if (session?.user?.role !== "admin") return { error: "権限がありません" };

    const rawExpiresAt = formData.get("expiresAt") as string;

    const parsed = couponSchema.safeParse({
        code: formData.get("code"),
        discountAmount: formData.get("discountAmount"),
        maxUses: formData.get("maxUses") || undefined,
        expiresAt: rawExpiresAt || undefined,
    });

    if (!parsed.success) return { error: "入力内容を確認してください" };

    try {
        await db.insert(coupons).values({
            code: parsed.data.code.toUpperCase(),
            discountAmount: parsed.data.discountAmount,
            maxUses: parsed.data.maxUses,
            expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        });
        revalidatePath("/admin/coupons");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "コードが重複しているか、エラーが発生しました" };
    }
}

export async function deleteCoupon(id: string) {
    const session = await auth();
    if (session?.user?.role !== "admin") return;

    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");
}
