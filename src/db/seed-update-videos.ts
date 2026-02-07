import { db } from "../lib/db";
import { lessons } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Updating video URLs...");

    // Get all lessons (assuming we have one module from previous seed)
    const allLessons = await db.select().from(lessons);

    // Use a generic placeholder video or Youtube video ID for demo
    // Example ID: 'dQw4w9WgXcQ' (Rick Roll - classic placeholder) or something safe like a scenery video '9bZkp7q19f0' (Psy style?)
    // Let's use a tech tutorial placeholder: 'jNQXAC9IVRw' (Me at the zoo)

    for (const lesson of allLessons) {
        if (lesson.type === 'video') {
            await db.update(lessons)
                .set({ videoUrl: "jNQXAC9IVRw" })
                .where(eq(lessons.id, lesson.id));
        }
    }

    console.log("Update complete!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
