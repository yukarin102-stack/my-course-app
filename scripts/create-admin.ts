import { db } from "../src/lib/db";
import { users } from "../src/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function createAdminUser() {
    const email = "yukarin102@gmail.com";
    const password = "2136";
    const name = "管理者";

    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

        if (existingUser) {
            console.log("ユーザーが既に存在します。パスワードを更新します...");

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.update(users)
                .set({
                    password: hashedPassword,
                    role: "admin"
                })
                .where(eq(users.email, email));

            console.log("✅ パスワードとロールを更新しました");
        } else {
            console.log("新しい管理者アカウントを作成します...");

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(users).values({
                email,
                password: hashedPassword,
                name,
                role: "admin",
            });

            console.log("✅ 管理者アカウントを作成しました");
        }

        console.log("\n--- ログイン情報 ---");
        console.log(`メール: ${email}`);
        console.log(`パスワード: ${password}`);
        console.log("ロール: admin");
        console.log("-------------------\n");

    } catch (error) {
        console.error("❌ エラーが発生しました:", error);
        process.exit(1);
    }
}

createAdminUser();
