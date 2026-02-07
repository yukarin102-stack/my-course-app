import { db } from "@/lib/db";
import { courses } from "@/db/schema";

async function main() {
    const allCourses = await db.select().from(courses).all();
    console.log("Courses found:", allCourses.length);
    if (allCourses.length > 0) {
        console.log("First course:", allCourses[0].title);
    }
}
main();
