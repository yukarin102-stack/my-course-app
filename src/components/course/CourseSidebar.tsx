"use client";

import Link from "next/link";
import styles from "./CourseSidebar.module.css";
import { PlayCircle, FileText, Check, HelpCircle, MessageSquare, Home } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

type Lesson = {
    id: string;
    title: string;
    type: "video" | "text" | "quiz" | "live" | "assignment";
    completed: boolean;
};

type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

type CourseSidebarProps = {
    courseId: string;
    courseTitle: string;
    modules: Module[];
};

export default function CourseSidebar({ courseId, courseTitle, modules }: CourseSidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLessonId = searchParams?.get('lessonId');
    const isCommunity = pathname?.includes("/community");

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <Link href="/dashboard" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>
                    &larr; ダッシュボードに戻る
                </Link>
                <h2 className={styles.courseTitle}>{courseTitle}</h2>
            </div>

            <div className={styles.navigationSection}>
                <Link href={`/courses/${courseId}/learn`} className={`${styles.navLink} ${!isCommunity && !currentLessonId ? styles.active : ''}`}>
                    <Home size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    ホーム (お知らせ)
                </Link>
                <Link href={`/courses/${courseId}/learn?lessonId=${modules[0]?.lessons[0]?.id}`} className={`${styles.navLink} ${!isCommunity && currentLessonId ? styles.active : ''}`}>
                    <PlayCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    レッスン
                </Link>
                <Link href={`/courses/${courseId}/community`} className={`${styles.navLink} ${isCommunity ? styles.active : ''}`}>
                    <MessageSquare size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    コミュニティ
                </Link>
            </div>

            <div className={styles.moduleList}>
                {modules.map((module) => (
                    <div key={module.id} className={styles.moduleItem}>
                        <div className={styles.moduleTitle}>{module.title}</div>
                        <ul className={styles.lessonList}>
                            {module.lessons.map((lesson) => (
                                <Link
                                    key={lesson.id}
                                    href={`/courses/${courseId}/learn?lessonId=${lesson.id}`}
                                    className={`${styles.lessonItem} ${!isCommunity && currentLessonId === lesson.id ? styles.active : ''}`}
                                >
                                    <div className={`${styles.checkbox} ${lesson.completed ? styles.completed : ''}`}>
                                        {lesson.completed && <Check size={12} color="white" />}
                                    </div>
                                    {lesson.type === 'video' ? <PlayCircle className={styles.lessonIcon} />
                                        : lesson.type === 'quiz' ? <HelpCircle className={styles.lessonIcon} />
                                            : <FileText className={styles.lessonIcon} />}
                                    <span style={{ marginLeft: '8px' }}>{lesson.title}</span>
                                </Link>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </aside>
    );
}
