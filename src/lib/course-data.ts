import { db } from "@/lib/db";
import { courses, modules, lessons, progress } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function getCourseWithProgress(courseId: string, userId: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    });

    if (!course) return null;

    const courseModules = await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order));

    const modulesWithLessons = await Promise.all(courseModules.map(async (mod) => {
        const modLessons = await db.select().from(lessons).where(eq(lessons.moduleId, mod.id)).orderBy(asc(lessons.order));
        const lessonsWithProgress = await Promise.all(modLessons.map(async (lesson) => {
            const prog = await db.select().from(progress)
                .where(and(eq(progress.userId, userId), eq(progress.lessonId, lesson.id)))
                .get();
            return { ...lesson, completed: !!prog?.completed };
        }));
        return { ...mod, lessons: lessonsWithProgress };
    }));

    return { course, modules: modulesWithLessons };
}
