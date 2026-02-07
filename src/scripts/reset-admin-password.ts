
import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
const bcrypt = require("bcryptjs");

async function main() {
    const adminEmail = "admin@example.com";
    const newPassword = "password123";

    console.log(`Resetting password for ${adminEmail}...`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ユーザーが存在するか確認
    const user = await db.select().from(users).where(eq(users.email, adminEmail)).get();

    if (user) {
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, user.id));
        console.log("Password reset successful.");
    } else {
        console.error("User not found!");
    }
}

main();
