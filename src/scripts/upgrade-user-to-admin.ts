import 'dotenv/config';
import { db } from "../lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const targetEmail = "yukarin102@gmail.com";

    console.log(`Looking for user: ${targetEmail}...`);

    const user = await db.select()
        .from(users)
        .where(eq(users.email, targetEmail))
        .get();

    if (!user) {
        console.error(`User ${targetEmail} not found!`);
        return;
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`Current role: ${user.role}`);

    if (user.role === 'admin') {
        console.log("This user is already an admin!");
        return;
    }

    // Upgrade to admin
    await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, user.id));

    console.log(`✓ Successfully upgraded ${user.email} to admin!`);
    console.log(`You can now log in at: https://online-course-platform-six.vercel.app/login`);
    console.log(`Email: ${user.email}`);
}

main().catch(console.error);
