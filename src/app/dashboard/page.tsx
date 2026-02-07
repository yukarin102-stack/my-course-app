import { auth } from "@/auth";
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

    const myCourses = await Promise.all(userEnrollments.map(async (enrollment) => {
        const course = await db.query.courses.findFirst({
            where: eq(courses.id, enrollment.courseId)
        });
        return course;
    }));

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

                <h2 className={styles.sectionTitle}>受講中の講座</h2>

                {myCourses.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>まだ受講中の講座はありません。</p>
                        <Link href="/" className={styles.browseButton}>講座を探す</Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {myCourses.map((course) => course && (
                            <div key={course.id} className={styles.card}>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    <Link href={`/courses/${course.id}/learn`}>
                                        <button className={styles.startButton}>
                                            <PlayCircle size={18} /> 学習を開始・再開する
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
