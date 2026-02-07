import { db } from "@/lib/db";
import { courses, modules, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "./CourseDetails.module.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PlayCircle, FileText } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
            modules: {
                with: {
                    lessons: true // We will sort manually since with relation sorting is tricky in simple query
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    // Sort modules and lessons
    // Note: in a real app, query-level sorting is better, but doing js sort for simplicity here
    // Assuming we fetch them somewhat ordered or just sort here
    const courseModules = await db.select().from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.order));

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(courseModules.map(async (mod) => {
        const modLessons = await db.select().from(lessons).where(eq(lessons.moduleId, mod.id)).orderBy(asc(lessons.order));
        return {
            ...mod,
            lessons: modLessons
        };
    }));

    const session = await auth();

    return (
        <>
            <Header />
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{course.title}</h1>
                    <p className={styles.description}>{course.description}</p>

                    <Link href={`/courses/${course.id}/enroll`}>
                        <button className={styles.enrollButton}>
                            この講座を受講する (¥{course.price.toLocaleString()})
                        </button>
                    </Link>
                </div>

                <h2 className={styles.sectionTitle}>カリキュラム</h2>
                <div className={styles.moduleList}>
                    {modulesWithLessons.map((module) => (
                        <div key={module.id} className={styles.moduleCard}>
                            <div className={styles.moduleHeader}>{module.title}</div>
                            {module.lessons.map((lesson) => (
                                <div key={lesson.id} className={`${styles.lessonItem} ${lesson.isFree ? styles.isFree : ''}`}>
                                    {lesson.type === 'video' ? <PlayCircle size={20} className={styles.lessonIcon} /> : <FileText size={20} className={styles.lessonIcon} />}
                                    <span>{lesson.title}</span>
                                    {lesson.isFree && <span className={styles.freeBadge}>無料プレビュー</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
