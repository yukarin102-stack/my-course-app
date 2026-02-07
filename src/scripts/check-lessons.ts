
import { db } from "../lib/db";
import { lessons } from "../db/schema";
import { eq, like } from "drizzle-orm";

async function main() {
    console.log("Searching for 'Test Live Lesson'...");
    const results = await db.select().from(lessons).where(like(lessons.title, "%Test Live Lesson%")).all();

    if (results.length === 0) {
        console.log("No lesson found with title containing 'Test Live Lesson'");
    } else {
        results.forEach(lesson => {
            console.log(`Found lesson: ID=${lesson.id}, Title='${lesson.title}', Type='${lesson.type}'`);
        });
    }
}

main();
