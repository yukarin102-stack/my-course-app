
import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const adminEmail = "admin@example.com";
    console.log(`Checking role for ${adminEmail}...`);

    const user = await db.select().from(users).where(eq(users.email, adminEmail)).get();

    if (!user) {
        console.error("Admin user not found. Please create admin@example.com first.");
        // Create it if not exists? Maybe safer to just warn.
        // Actually, let's create it to be helpful.
        const crypto = require("crypto");
        const bcrypt = require("bcryptjs");
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            email: adminEmail,
            name: "Admin User",
            password: hashedPassword,
            role: "admin"
        });
        console.log(`Created admin user with password: ${password}`);
    } else {
        if (user.role !== "admin") {
            await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
            console.log("Updated user role to admin.");
        } else {
            console.log("User is already admin.");
        }
    }
}

main();
