import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function main() {
    try {
        console.log("Updating announcements table...");

        // Add course_id
        try {
            await db.run(sql`ALTER TABLE announcements ADD COLUMN course_id text REFERENCES courses(id) ON DELETE CASCADE`);
            console.log("Added course_id column");
        } catch (e) {
            console.log("course_id column might already exist or error:", e);
        }

        // Add video_url
        try {
            await db.run(sql`ALTER TABLE announcements ADD COLUMN video_url text`);
            console.log("Added video_url column");
        } catch (e) {
            console.log("video_url column might already exist or error:", e);
        }

        console.log("Announcements table updated.");

    } catch (e: any) {
        console.error("Migration failed:", e);
    }
}
main();
