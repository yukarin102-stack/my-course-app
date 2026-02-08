import { auth } from "@/auth";
export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import { enrollments, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "./Dashboard.module.css";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import AnnouncementList from "@/components/dashboard/AnnouncementList";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ enrolled?: string }> }) {
    const session = await auth();
    const { enrolled } = await searchParams;

    const userEnrollments = await db.select()
        .from(enrollments)
        .where(eq(enrollments.userId, session?.user?.id!));

    // Fetch ALL published courses
    const allPublishedCourses = await db.query.courses.findMany({
        where: eq(courses.published, true),
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return (
        <>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>マイページ</h1>

                {enrolled && (
                    <div className={styles.successMessage}>
                        講座の申し込みが完了しました！さっそく学習を始めましょう。
                    </div>
                )}

                {/* Announcements Section */}
                <AnnouncementList />

                <h2 className={styles.sectionTitle}>講座一覧</h2>

                <div className={styles.grid}>
                    {allPublishedCourses.map((course) => {
                        const isEnrolled = userEnrollments.some(e => e.courseId === course.id);
                        return (
                            <div key={course.id} className={styles.card}>
                                <div className={styles.thumbnailWrapper}>
                                    {course.thumbnailUrl ? (
                                        <img src={course.thumbnailUrl} alt={course.title} className={styles.thumbnail} />
                                    ) : (
                                        <div className={styles.thumbnailPlaceholder}>
                                            <span>No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    {isEnrolled ? (
                                        <Link href={`/courses/${course.id}/learn`}>
                                            <button className={styles.startButton}>
                                                <PlayCircle size={18} /> 学習を開始・再開する
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href={`/view/${course.id}`}>
                                            <button className={styles.viewButton}>
                                                講座詳細を見る
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {allPublishedCourses.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>現在公開中の講座はありません。</p>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
