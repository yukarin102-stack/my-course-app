"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/courses/[id]/learn/Learn.module.css";

type Props = {
    courseId: string;
    currentLessonId: string;
    prevLessonId: string | null;
    nextLessonId: string | null;
};

export default function PublicNavigation({ courseId, currentLessonId, prevLessonId, nextLessonId }: Props) {
    const router = useRouter();

    const handleNext = () => {
        // Mark current lesson as completed
        const storageKey = `course_${courseId}_progress`;
        const stored = localStorage.getItem(storageKey);
        const completed: string[] = stored ? JSON.parse(stored) : [];

        if (!completed.includes(currentLessonId)) {
            completed.push(currentLessonId);
            localStorage.setItem(storageKey, JSON.stringify(completed));
        }

        // Navigate to next lesson
        if (nextLessonId) {
            router.push(`/view/${courseId}?lessonId=${nextLessonId}`);
        }
    };

    return (
        <div className={styles.navigationButtons}>
            {prevLessonId ? (
                <Link href={`/view/${courseId}?lessonId=${prevLessonId}`}>
                    <button className={styles.navButton}>
                        <ChevronLeft size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        前のレッスン
                    </button>
                </Link>
            ) : (
                <button className={styles.navButton} disabled>前のレッスン</button>
            )}

            {nextLessonId ? (
                <button onClick={handleNext} className={`${styles.navButton} ${styles.nextButton}`}>
                    次のレッスン
                    <ChevronRight size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                </button>
            ) : (
                <button className={`${styles.navButton} ${styles.nextButton}`}>
                    講座を完了
                </button>
            )}
        </div>
    );
}
