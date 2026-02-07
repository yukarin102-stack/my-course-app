"use server";

import { db } from "@/lib/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
    email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
});

export async function subscribeLead(formData: FormData) {
    const email = formData.get("email") as string;

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    try {
        // Check if email exists
        // Note: In real app, might just update or ignore
        const existing = await db.select().from(leads).where(eq(leads.email, email)).get();

        if (existing) {
            return { success: true, message: "既に登録されています。ダウンロードリンクを再送しました。" };
        }

        await db.insert(leads).values({
            email,
            source: "lead_magnet_campaign_a",
        });

        // Here we would send the email with SendGrid/Resend/etc.
        console.log(`Sending lead magnet to ${email}`);

        return { success: true, message: "資料のダウンロードリンクをメールでお送りしました！" };
    } catch (error) {
        console.error("Lead subscription error:", error);
        return { error: "登録中にエラーが発生しました。しばらくしてから再度お試しください。" };
    }
}
