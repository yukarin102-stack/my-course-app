
import { db } from "../lib/db";
import { users, courses, enrollments } from "../db/schema";
import { desc, eq } from "drizzle-orm";

async function main() {
    try {
        console.log("Starting enrollment script...");

        // 全ユーザーを取得
        const targetUsers = await db.select().from(users);

        if (targetUsers.length === 0) {
            console.error("No users found. Please register a user first.");
            process.exit(1);
        }

        console.log(`Found ${targetUsers.length} users. Enrolling all of them...`);

        // コースを取得
        const allCourses = await db.select().from(courses);
        if (!allCourses || allCourses.length === 0) {
            console.error("No courses found inside database.");
            process.exit(1);
        }

        // 全てのコースにエンロールさせる
        for (const user of targetUsers) {
            for (const course of allCourses) {
                // 重複チェック
                const existing = await db.select().from(enrollments)
                    .where(eq(enrollments.userId, user.id));

                const isEnrolled = existing.some(e => e.courseId === course.id);

                if (isEnrolled) {
                    // console.log(`User ${user.email} is already enrolled in course: ${course.title}`);
                    continue;
                }

                // エンロール実行
                await db.insert(enrollments).values({
                    userId: user.id,
                    courseId: course.id,
                });

                console.log(`Successfully enrolled user ${user.email} into course: ${course.title}`);
            }
        }

        console.log("Enrollment process completed.");
    } catch (e) {
        console.error("Error executing script:", e);
        process.exit(1);
    }
}

main();
