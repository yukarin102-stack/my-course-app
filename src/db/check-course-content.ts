import { db } from "@/lib/db";
import { courses, modules, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const course = await db.query.courses.findFirst({
        with: {
            modules: {
                with: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        console.log("No course found");
        return;
    }

    console.log(`Course: ${course.title} (${course.id})`);
    console.log(`Modules: ${course.modules.length}`);
    course.modules.forEach(m => {
        console.log(`  Module: ${m.title}, Lessons: ${m.lessons.length}`);
    });
}
main();
