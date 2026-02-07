import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    const email = "0000@example.com";
    const password = "2136";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        await db.update(users).set({
            password: hashedPassword,
            role: "admin",
            name: "Admin 0000"
        }).where(eq(users.email, email));
        console.log("Updated existing admin user.");
    } else {
        await db.insert(users).values({
            email,
            password: hashedPassword,
            role: "admin",
            name: "Admin 0000",
        });
        console.log("Created new admin user.");
    }
}

main().catch(console.error).then(() => process.exit(0));
