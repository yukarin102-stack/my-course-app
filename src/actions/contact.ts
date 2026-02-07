"use server";

import { db } from "@/lib/db";
import { inquiries } from "@/db/schema";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1, "お名前は必須です"),
    email: z.string().email("メールアドレスの形式が正しくありません"),
    subject: z.string().min(1, "件名は必須です"),
    message: z.string().min(10, "メッセージは10文字以上で入力してください"),
});

export async function sendInquiry(prevState: any, formData: FormData) {
    const parsed = contactSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    });

    if (!parsed.success) {
        return { error: "入力内容を確認してください" };
    }

    try {
        await db.insert(inquiries).values({
            name: parsed.data.name,
            email: parsed.data.email,
            subject: parsed.data.subject,
            message: parsed.data.message,
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "送信中にエラーが発生しました。時間をおいて再度お試しください。" };
    }
}
