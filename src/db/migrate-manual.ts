import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { lessons } from "@/db/schema";

async function main() {
    try {
        console.log("Creating submissions table...");
        await db.run(sql`
            CREATE TABLE IF NOT EXISTS submissions (
                id text PRIMARY KEY NOT NULL,
                lesson_id text NOT NULL,
                user_id text NOT NULL,
                content text,
                file_url text,
                status text DEFAULT 'submitted' NOT NULL,
                grade integer,
                feedback text,
                created_at integer DEFAULT CURRENT_TIMESTAMP,
                updated_at integer DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON UPDATE no action ON DELETE cascade,
                FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE cascade
            );
        `);
        console.log("Submissions table created.");

        console.log("Testing assignment insertion...");
        const module = await db.query.modules.findFirst();
        if (module) {
            await db.insert(lessons).values({
                title: "Test Assignment Manual",
                type: "assignment",
                moduleId: module.id,
                order: 1000,
            });
            console.log("Assignment insertion successful.");
        } else {
            console.log("No module found to test insertion.");
        }

    } catch (e: any) {
        console.error("Migration failed:", e);
    }
}
main();
