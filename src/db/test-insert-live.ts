import { db } from "@/lib/db";
import { lessons, modules, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    try {
        console.log("Attempting to insert live lesson...");
        // Get a module
        const module = await db.query.modules.findFirst();
        if (!module) {
            console.error("No module found");
            return;
        }

        const res = await db.insert(lessons).values({
            title: "Test Live Lesson",
            type: "live",
            videoUrl: "http://test",
            description: "test",
            moduleId: module.id,
            order: 999,
        }).returning();

        console.log("Inserted:", res);
    } catch (e: any) {
        console.error("Insertion failed:", e.message);
        if (e.code) console.error("Code:", e.code);
    }
}
main();
