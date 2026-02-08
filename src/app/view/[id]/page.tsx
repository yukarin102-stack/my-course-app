import { db } from "@/lib/db";
import { courses, modules, lessons, quizQuestions, quizOptions, progress } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "../../courses/[id]/learn/Learn.module.css";
import { BookOpen } from "lucide-react";
import PublicSidebar from "@/components/view/PublicSidebar";
import PublicNavigation from "@/components/view/PublicNavigation";
import QuizPlayer from "@/components/learn/QuizPlayer";
import { auth } from "@/auth";

export default async function PublicViewPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ lessonId?: string }>
}) {
    const { id } = await params;
    const { lessonId } = await searchParams;
    const session = await auth();

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!course) notFound();

    // Get modules and lessons
    const courseModules = await db.select().from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.order));
    const modulesWithLessons = await Promise.all(courseModules.map(async (mod) => {
        const modLessons = await db.select().from(lessons).where(eq(lessons.moduleId, mod.id)).orderBy(asc(lessons.order));
        return { ...mod, lessons: modLessons };
    }));

    // Flatten lessons
    const allLessons = modulesWithLessons.flatMap(m => m.lessons);

    if (allLessons.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#fff5f7' }}>
                <BookOpen size={64} color="#ec4899" />
                <h1 style={{ marginTop: '1rem', fontSize: '1.5rem', color: '#9d174d' }}>{course.title}</h1>
                <p style={{ color: '#6b7280' }}>まだレッスンが登録されていません。</p>
            </div>
        );
    }

    // Prepare modules data for client component
    const modulesData = modulesWithLessons.map(m => ({
        id: m.id,
        title: m.title,
        lessons: m.lessons.map(l => ({
            id: l.id,
            title: l.title,
            type: l.type
        }))
    }));

    const currentLesson = lessonId
        ? allLessons.find(l => l.id === lessonId)
        : allLessons[0];

    if (!currentLesson) {
        return <div>Lesson not found</div>;
    }

    // Security Check: Only allow free lessons in public view
    if (!currentLesson.isFree) {
        return (
            <div className={styles.container}>
                <PublicSidebar
                    courseId={id}
                    courseTitle={course.title}
                    modules={modulesData}
                    currentLessonId={currentLesson.id}
                />
                <main className={styles.mainContent}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' }}>
                            このレッスンは有料コンテンツです
                        </h2>
                        <p style={{ marginBottom: '2rem', color: '#475569' }}>
                            この続きをご覧になるには、講座の購入が必要です。<br />
                            すでに購入済みの方は、ログインして学習ページからアクセスしてください。
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a
                                href={`/login?callbackUrl=/courses/${id}/learn?lessonId=${currentLesson.id}`}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    textDecoration: 'none'
                                }}
                            >
                                ログインして視聴する
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    // Fetch Quiz Data if current lesson is a quiz
    type QuestionWithOptions = typeof quizQuestions.$inferSelect & {
        options: typeof quizOptions.$inferSelect[]
    };
    let quizData: QuestionWithOptions[] = [];

    if (currentLesson.type === 'quiz') {
        const questions = await db.query.quizQuestions.findMany({
            where: eq(quizQuestions.lessonId, currentLesson.id),
            orderBy: [asc(quizQuestions.order)],
            with: {
                options: {
                    orderBy: [asc(quizOptions.order)],
                }
            }
        });
        quizData = questions;
    }

    // Check completion status (for quiz)
    let isCompleted = false;
    if (session?.user?.id) {
        const userId = session.user.id;
        const progressRecord = await db.query.progress.findFirst({
            where: (progress, { and, eq }) => and(
                eq(progress.userId, userId),
                eq(progress.lessonId, currentLesson.id)
            ),
        });
        isCompleted = !!progressRecord?.completed;
    }

    return (
        <div className={styles.container}>
            <PublicSidebar
                courseId={id}
                courseTitle={course.title}
                modules={modulesData}
                currentLessonId={currentLesson.id}
            />

            <main className={styles.mainContent}>
                {currentLesson.type === 'quiz' && (
                    <div className={styles.contentBody}>
                        <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>
                        <QuizPlayer
                            questions={quizData as any}
                            lessonId={currentLesson.id}
                            courseId={id}
                            nextLessonId={nextLesson?.id}
                            initialCompleted={isCompleted}
                        />
                    </div>
                )}

                {currentLesson.type === 'video' && (
                    <div className={styles.videoContainer}>
                        {currentLesson.videoUrl ? (
                            (() => {
                                const isYouTubeId = currentLesson.videoUrl && !currentLesson.videoUrl.includes('http') && currentLesson.videoUrl.length <= 15;
                                if (isYouTubeId) {
                                    return (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${currentLesson.videoUrl}?rel=0&modestbranding=1&showinfo=0`}
                                            style={{ border: 0 }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    );
                                } else {
                                    const videoUrl = currentLesson.videoUrl;
                                    const isGoogleDrive = videoUrl.includes('drive.google.com');

                                    if (isGoogleDrive) {
                                        let embedUrl = videoUrl;
                                        const fileIdMatch = videoUrl.match(/\/d\/([^\/]+)/);
                                        if (fileIdMatch) {
                                            const fileId = fileIdMatch[1];
                                            embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                                        } else {
                                            embedUrl = videoUrl.replace('/view', '/preview');
                                        }
                                        return (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={embedUrl}
                                                style={{ border: 0 }}
                                                allow="autoplay"
                                                allowFullScreen
                                            />
                                        );
                                    } else {
                                        return (
                                            <video width="100%" height="100%" controls style={{ backgroundColor: '#000' }}>
                                                <source src={videoUrl} type="video/mp4" />
                                                お使いのブラウザは動画タグに対応していません。
                                            </video>
                                        );
                                    }
                                }
                            })()
                        ) : (
                            <div style={{
                                color: '#fff',
                                fontSize: '1.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                backgroundColor: '#000',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="black">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span>動画が設定されていません</span>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.contentBody}>
                    <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>

                    {currentLesson.description && (
                        <div
                            style={{
                                lineHeight: '1.8',
                                color: '#333',
                                marginBottom: '2rem',
                                fontFamily: '"Yu Gothic", "YuGothic", sans-serif',
                                whiteSpace: 'pre-wrap'
                            }}
                            dangerouslySetInnerHTML={{ __html: currentLesson.description }}
                        />
                    )}

                    {/* 参考資料ダウンロード */}
                    {currentLesson.attachmentUrl && (() => {
                        // Detect file type from name or URL
                        const fileName = currentLesson.attachmentName || currentLesson.attachmentUrl;
                        const ext = fileName.toLowerCase().split('.').pop() || '';

                        // File type icons and colors
                        let icon = '📄';
                        let bgColor = '#6b7280';
                        let label = 'ファイル';

                        if (['pdf'].includes(ext)) {
                            icon = '📕'; bgColor = '#dc2626'; label = 'PDF';
                        } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
                            icon = '📊'; bgColor = '#16a34a'; label = 'Excel';
                        } else if (['docx', 'doc'].includes(ext)) {
                            icon = '📝'; bgColor = '#2563eb'; label = 'Word';
                        } else if (['pptx', 'ppt'].includes(ext)) {
                            icon = '📽️'; bgColor = '#ea580c'; label = 'PowerPoint';
                        } else if (['zip', 'rar', '7z'].includes(ext)) {
                            icon = '📦'; bgColor = '#7c3aed'; label = '圧縮ファイル';
                        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                            icon = '🖼️'; bgColor = '#0891b2'; label = '画像';
                        } else if (['mp4', 'mov', 'avi'].includes(ext)) {
                            icon = '🎬'; bgColor = '#be185d'; label = '動画';
                        } else if (['mp3', 'wav', 'm4a'].includes(ext)) {
                            icon = '🎵'; bgColor = '#9333ea'; label = '音声';
                        }

                        return (
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: '#f0f4f8',
                                borderRadius: '8px',
                                marginBottom: '2rem',
                                border: '1px solid #c5d4e3'
                            }}>
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    color: '#1e3a5f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    📎 参考資料
                                </h3>
                                <a
                                    href={currentLesson.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem 1.5rem',
                                        backgroundColor: 'white',
                                        border: '1px solid #d4e0ed',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        transition: 'box-shadow 0.2s, transform 0.2s'
                                    }}
                                >
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 48,
                                        height: 48,
                                        backgroundColor: bgColor,
                                        borderRadius: '8px',
                                        fontSize: '1.5rem'
                                    }}>
                                        {icon}
                                    </span>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1e3a5f', marginBottom: '0.25rem' }}>
                                            {currentLesson.attachmentName || 'ダウンロード'}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {label}ファイル
                                        </div>
                                    </div>
                                    <span style={{ marginLeft: '0.5rem', color: '#2563eb' }}>
                                        ↓
                                    </span>
                                </a>
                            </div>
                        );
                    })()}

                    <PublicNavigation
                        courseId={id}
                        currentLessonId={currentLesson.id}
                        prevLessonId={prevLesson?.id || null}
                        nextLessonId={nextLesson?.id || null}
                    />
                </div>
            </main>
        </div>
    );
}
