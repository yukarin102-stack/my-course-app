import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function main() {
    const email = "preview@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomUUID();

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

        if (existingUser) {
            console.log("User already exists. Updating password and role...");
            await db.update(users)
                .set({ password: hashedPassword, role: "admin", emailVerified: new Date() })
                .where(eq(users.email, email));
        } else {
            console.log("Creating new admin user...");
            await db.insert(users).values({
                id,
                email,
                password: hashedPassword,
                name: "プレビュー用管理者",
                role: "admin",
                emailVerified: new Date(),
            });
        }

        console.log(`\nSuccess! User credentials:\nEmail: ${email}\nPassword: ${password}\n`);
    } catch (error) {
        console.error("Error creating admin user:", error);
    }
}

main();
