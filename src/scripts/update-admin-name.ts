
import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Updating admin user name...");

    // admin@example.com のユーザーを検索して更新
    const result = await db.update(users)
        .set({ name: "管理者" })
        .where(eq(users.email, "admin@example.com"))
        .returning();

    if (result.length > 0) {
        console.log("Successfully updated admin name to '管理者'");
        console.log(result[0]);
    } else {
        console.log("Admin user not found.");
    }
}

main();
