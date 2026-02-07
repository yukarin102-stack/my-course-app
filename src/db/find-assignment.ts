import { db } from "@/lib/db";
import { lessons, modules } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.title, "Test Assignment Manual"),
        with: {
            module: true
        }
    });

    if (lesson) {
        console.log(`Found: ${lesson.id}, Course: ${lesson.module.courseId}`);
    } else {
        console.log("Not found");
    }
}
main();
