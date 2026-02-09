"use client";

import Link from "next/link";
import { PlayCircle, Check, FileText, HelpCircle, Radio, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "@/app/courses/[id]/learn/Learn.module.css";

type Lesson = {
    id: string;
    title: string;
    type: string;
};

type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

type Props = {
    courseId: string;
    courseTitle: string;
    modules: Module[];
    currentLessonId: string;
};

export default function PublicSidebar({ courseId, courseTitle, modules, currentLessonId }: Props) {
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    useEffect(() => {
        // Load completed lessons from localStorage
        const stored = localStorage.getItem(`course_${courseId}_progress`);
        if (stored) {
            setCompletedLessons(JSON.parse(stored));
        }
    }, [courseId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'text':
                return <FileText size={16} style={{ color: '#2563eb', flexShrink: 0 }} />;
            case 'quiz':
                return <HelpCircle size={16} style={{ color: '#2563eb', flexShrink: 0 }} />;
            case 'live':
                return <Radio size={16} style={{ color: '#2563eb', flexShrink: 0 }} />;
            case 'assignment':
                return <ClipboardList size={16} style={{ color: '#2563eb', flexShrink: 0 }} />;
            default:
                return <PlayCircle size={16} style={{ color: '#2563eb', flexShrink: 0 }} />;
        }
    };

    return (
        <aside className={styles.sidebar} style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className={styles.sidebarHeader} style={{ position: 'sticky', top: 0, zIndex: 10, flexShrink: 0, backgroundColor: '#dce5ee' }}>
                <h2 className={styles.courseTitle}>{courseTitle}</h2>
            </div>
            <nav className={styles.lessonList} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {modules.map((mod) => (
                    <div key={mod.id} className={styles.moduleGroup}>
                        <div className={styles.moduleHeader}>{mod.title}</div>
                        {mod.lessons.map((lesson) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isActive = lesson.id === currentLessonId;

                            return (
                                <Link
                                    key={lesson.id}
                                    href={`/view/${courseId}?lessonId=${lesson.id}`}
                                    className={`${styles.lessonItem} ${isActive ? styles.active : ''}`}
                                >
                                    {isCompleted ? (
                                        <span style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            backgroundColor: '#2563eb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Check size={12} color="white" />
                                        </span>
                                    ) : (
                                        getIcon(lesson.type)
                                    )}
                                    <span>{lesson.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
