"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "すべての項目を入力してください。" };
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
    if (existingUser) {
        return { error: "このメールアドレスは既に登録されています。" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    try {
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "登録中にエラーが発生しました。" };
    }
}
