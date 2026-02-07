import { db } from "@/lib/db";
import { posts, comments } from "@/db/schema";

async function main() {
    try {
        const allPosts = await db.select().from(posts).all();
        console.log("Posts table exists. Count:", allPosts.length);

        const allComments = await db.select().from(comments).all();
        console.log("Comments table exists. Count:", allComments.length);
    } catch (e) {
        console.error("Error accessing community tables:", e);
    }
}
main();
