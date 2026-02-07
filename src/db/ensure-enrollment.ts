import { db } from "@/lib/db";
import { users, courses, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const email = "0000@example.com";
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error("Admin user not found");
        return;
    }

    const course = await db.query.courses.findFirst();
    if (!course) {
        console.error("No courses found");
        return;
    }

    // Check enrollment
    const enrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
            eq(enrollments.userId, user.id),
            eq(enrollments.courseId, course.id)
        )
    });

    if (!enrollment) {
        console.log(`Enrolling admin in course: ${course.title}`);
        await db.insert(enrollments).values({
            userId: user.id,
            courseId: course.id,
        });
        console.log("Enrolled.");
    } else {
        console.log("Admin already enrolled.");
    }
}

main();
