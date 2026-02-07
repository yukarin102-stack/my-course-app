import { db } from "../lib/db";
import { users, courses, modules, lessons } from "./schema";

async function main() {
    console.log("Seeding database...");

    // Create Admin User
    const [admin] = await db.insert(users).values({
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
    }).returning();

    console.log("Created admin user:", admin.id);

    // Create Sample Course
    const [course] = await db.insert(courses).values({
        title: "Youtube完全攻略マスターコース",
        description: "Youtubeの始め方から収益化までを完全網羅したマスターコースです。",
        price: 29800,
        published: true,
    }).returning();

    console.log("Created course:", course.title);

    // Create Module
    const [mod] = await db.insert(modules).values({
        courseId: course.id,
        title: "第1章: Youtubeの基礎知識",
        order: 1,
    }).returning();

    // Create Lesson
    await db.insert(lessons).values({
        moduleId: mod.id,
        title: "Youtubeの仕組みを理解しよう",
        type: "video",
        order: 1,
        isFree: true,
    });

    console.log("Seeding complete!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
