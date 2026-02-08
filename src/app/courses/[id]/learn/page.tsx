import { auth, signIn } from "@/auth";
import { db } from "@/lib/db";
import { courses, modules, lessons, progress, quizQuestions, quizOptions, submissions, oneTimeTokens } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import styles from "./Learn.module.css";
import Link from "next/link";
import { PlayCircle, FileText, Check, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { markLessonComplete } from "@/actions/progress";
import QuizPlayer from "@/components/learn/QuizPlayer";
import LivePlayer from "@/components/learn/LivePlayer";
import AssignmentPlayer from "@/components/learn/AssignmentPlayer";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseHome from "@/components/learn/CourseHome";
import { announcements } from "@/db/schema";
import { desc, type InferSelectModel } from "drizzle-orm";

type Announcement = InferSelectModel<typeof announcements>;

export default async function LearnPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ lessonId?: string, token?: string }>
}) {
    const { id } = await params;
    const { lessonId, token } = await searchParams;

    // トークンがある場合、自動ログイン処理
    if (token) {
        const tokenRecord = await db.select()
            .from(oneTimeTokens)
            .where(eq(oneTimeTokens.token, token))
            .get();

        if (tokenRecord && !tokenRecord.used && new Date() < new Date(tokenRecord.expiresAt)) {
            // トークンを使用済みにする
            await db.update(oneTimeTokens)
                .set({ used: true })
                .where(eq(oneTimeTokens.id, tokenRecord.id));

            // TODO: セッション作成（NextAuthのsignIn機能を使う必要がある）
            // 現在はログインページにリダイレクトしてメッセージを表示
            redirect(`/login?message=payment_success&callbackUrl=/courses/${id}/learn${lessonId ? `?lessonId=${lessonId}` : ''}`);
        }
    }

    const session = await auth();
    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/courses/${id}/learn`);
    }

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!course) notFound();

    // Get data
    const courseModules = await db.select().from(modules).where(eq(modules.courseId, id)).orderBy(asc(modules.order));
    const modulesWithLessons = await Promise.all(courseModules.map(async (mod) => {
        const modLessons = await db.select().from(lessons).where(eq(lessons.moduleId, mod.id)).orderBy(asc(lessons.order));
        const lessonsWithProgress = await Promise.all(modLessons.map(async (lesson) => {
            const prog = await db.select().from(progress)
                .where(and(eq(progress.userId, session.user!.id!), eq(progress.lessonId, lesson.id)))
                .get();
            return { ...lesson, completed: !!prog?.completed };
        }));
        return { ...mod, lessons: lessonsWithProgress };
    }));

    // Flatten lessons to find current, prev, next
    const allLessons = modulesWithLessons.flatMap(m => m.lessons);

    if (allLessons.length === 0) return <div>No lessons found</div>;

    // Announcement data (needed for home view)
    // Only fetch if no lessonId or explicitly home
    let announcementsList: Announcement[] = [];
    if (!lessonId) {
        announcementsList = await db.query.announcements.findMany({
            where: eq(announcements.courseId, id),
            orderBy: [desc(announcements.createdAt)],
        });
    }

    const currentLesson = lessonId
        ? allLessons.find(l => l.id === lessonId)
        : null;

    let prevLesson = null;
    let nextLesson = null;
    let quizData = null;
    let assignmentSubmission = null;

    if (currentLesson) {
        const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
        prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
        nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

        if (currentLesson.type === 'quiz') {
            const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.lessonId, currentLesson.id)).orderBy(asc(quizQuestions.order));
            const questionsWithOptions = await Promise.all(questions.map(async (q) => {
                const options = await db.select().from(quizOptions).where(eq(quizOptions.questionId, q.id)).orderBy(asc(quizOptions.order));
                return { ...q, options };
            }));
            quizData = questionsWithOptions;
        } else if (currentLesson.type === 'assignment') {
            assignmentSubmission = await db.select().from(submissions)
                .where(and(eq(submissions.userId, session.user!.id!), eq(submissions.lessonId, currentLesson.id)))
                .get();
        }
    }

    return (
        <div className={styles.container}>
            <CourseSidebar
                courseId={id}
                courseTitle={course.title}
                modules={modulesWithLessons as any}
            />

            {/* Main Content */}
            <main className={styles.mainContent}>
                {!currentLesson ? (
                    <CourseHome courseTitle={course.title} announcements={announcementsList as any} />
                ) : (
                    <>
                        {currentLesson.type === 'video' ? (
                            <div className={styles.videoContainer}>
                                {currentLesson.videoUrl ? (
                                    (() => {
                                        const isYouTubeId = currentLesson.videoUrl && !currentLesson.videoUrl.includes('http') && currentLesson.videoUrl.length <= 15;
                                        if (isYouTubeId) {
                                            return (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${currentLesson.videoUrl}`}
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                />
                                            );
                                        } else {
                                            // Check for various video sources
                                            const videoUrl = currentLesson.videoUrl;
                                            const isGoogleDrive = videoUrl.includes('drive.google.com');
                                            const isDropbox = videoUrl.includes('dropbox.com');
                                            const isLocalFile = videoUrl.startsWith('/uploads/');

                                            if (isGoogleDrive) {
                                                // Convert Google Drive URL to embeddable format
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
                                            } else if (isDropbox) {
                                                const embedUrl = videoUrl.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
                                                return (
                                                    <video width="100%" height="100%" controls style={{ backgroundColor: '#000' }}>
                                                        <source src={embedUrl} type="video/mp4" />
                                                        お使いのブラウザは動画タグに対応していません。
                                                    </video>
                                                );
                                            } else if (isLocalFile) {
                                                return (
                                                    <video width="100%" height="100%" controls style={{ backgroundColor: '#000' }}>
                                                        <source src={videoUrl} type="video/mp4" />
                                                        お使いのブラウザは動画タグに対応していません。
                                                    </video>
                                                );
                                            } else {
                                                return (
                                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                        <p style={{ marginBottom: '1rem', color: '#ccc' }}>外部動画リンク</p>
                                                        <a
                                                            href={videoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '1rem 2rem',
                                                                backgroundColor: '#2563eb',
                                                                color: 'white',
                                                                borderRadius: '8px',
                                                                textDecoration: 'none',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            動画を新しいタブで開く
                                                        </a>
                                                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#888' }}>
                                                            {videoUrl}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                        }
                                    })()
                                ) : (
                                    <div style={{ color: '#555', fontSize: '1.5rem' }}>Video Placeholder</div>
                                )}
                            </div>
                        ) : currentLesson.type === 'live' ? (
                            <LivePlayer
                                videoUrl={currentLesson.videoUrl}
                                title={currentLesson.title}
                                description={currentLesson.description}
                            />
                        ) : (
                            <div style={{ padding: '3rem 2rem', borderBottom: '1px solid #333', backgroundColor: '#111' }}>
                                <h1 className={styles.lessonTitle} style={{ marginBottom: 0 }}>{currentLesson.title}</h1>
                            </div>
                        )}

                        <div className={styles.contentBody}>
                            {(currentLesson.type === 'video' || currentLesson.type === 'live') && (
                                <h1 className={styles.lessonTitle}>{currentLesson.title}</h1>
                            )}

                            {currentLesson.type !== 'assignment' && (
                                <div
                                    style={{
                                        lineHeight: '1.8',
                                        color: '#000',
                                        marginBottom: '2rem',
                                        fontFamily: '"Yu Gothic", "YuGothic", sans-serif',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: currentLesson.description || '' }}
                                />
                            )}

                            {currentLesson.type === 'quiz' && quizData && (
                                <QuizPlayer
                                    questions={quizData}
                                    lessonId={currentLesson.id}
                                    courseId={id}
                                    nextLessonId={nextLesson?.id}
                                    initialCompleted={currentLesson.completed}
                                />
                            )}

                            {currentLesson.type === 'assignment' && (
                                <AssignmentPlayer
                                    lessonId={currentLesson.id}
                                    courseId={id}
                                    title={currentLesson.title}
                                    description={currentLesson.description}
                                    submission={assignmentSubmission as any}
                                />
                            )}

                            {currentLesson.type === 'text' && (
                                <div style={{ padding: '2rem', backgroundColor: '#222', borderRadius: '8px' }}>
                                    <p>ここにテキスト教材が入ります。</p>
                                </div>
                            )}

                            <div className={styles.navigationButtons}>
                                {prevLesson ? (
                                    <Link href={`/courses/${id}/learn?lessonId=${prevLesson.id}`}>
                                        <button className={styles.navButton}>
                                            <ChevronLeft size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                            前のレッスン
                                        </button>
                                    </Link>
                                ) : (
                                    <button className={styles.navButton} disabled>前のレッスン</button>
                                )}

                                {(currentLesson.type !== 'quiz' && currentLesson.type !== 'assignment') && (
                                    nextLesson ? (
                                        <form action={markLessonComplete}>
                                            <input type="hidden" name="lessonId" value={currentLesson.id} />
                                            <input type="hidden" name="nextLessonId" value={nextLesson.id} />
                                            <input type="hidden" name="courseId" value={id} />
                                            <button type="submit" className={`${styles.navButton} ${styles.nextButton}`}>
                                                次のレッスン
                                                <ChevronRight size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                                            </button>
                                        </form>
                                    ) : (
                                        <button className={`${styles.navButton} ${styles.nextButton}`}>
                                            講座を完了する
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
