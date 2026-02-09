import { db } from "../lib/db";
import { users } from "../db/schema";
import { desc, eq } from "drizzle-orm";

async function main() {
    console.log("Fetching the most recently created user...");

    // Get the most recent user
    const latestUser = await db.select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(1)
        .get();

    if (!latestUser) {
        console.error("No users found in the database!");
        return;
    }

    console.log(`Found user: ${latestUser.email} (ID: ${latestUser.id})`);
    console.log(`Current role: ${latestUser.role}`);

    if (latestUser.role === 'admin') {
        console.log("This user is already an admin!");
        return;
    }

    // Upgrade to admin
    await db.update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, latestUser.id));

    console.log(`✓ Successfully upgraded ${latestUser.email} to admin!`);
}

main().catch(console.error);
