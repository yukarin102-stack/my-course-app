import 'dotenv/config';
import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    const targetEmail = "yukarin102@gmail.com";
    const newPassword = "2136";

    console.log(`Resetting password for: ${targetEmail}...`);

    const user = await db.select()
        .from(users)
        .where(eq(users.email, targetEmail))
        .get();

    if (!user) {
        console.error(`User ${targetEmail} not found!`);
        console.log("Creating new user...");

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.insert(users).values({
            email: targetEmail,
            name: "Admin",
            password: hashedPassword,
            role: "admin"
        });

        console.log(`✓ Created admin user: ${targetEmail}`);
        console.log(`Password: ${newPassword}`);
        return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`Current role: ${user.role}`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and ensure admin role
    await db.update(users)
        .set({
            password: hashedPassword,
            role: 'admin'
        })
        .where(eq(users.id, user.id));

    console.log(`✓ Successfully reset password for ${user.email}`);
    console.log(`New password: ${newPassword}`);
    console.log(`Role: admin`);
}

main().catch(console.error);
