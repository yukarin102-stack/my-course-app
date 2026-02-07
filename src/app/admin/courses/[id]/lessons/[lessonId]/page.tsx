import { auth } from "@/auth";
import { db } from "@/lib/db";
import { lessons, modules, courses, quizQuestions, quizOptions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import LessonEditForm from "@/components/admin/LessonEditForm";
import QuizEditor from "@/components/admin/QuizEditor";

export default async function EditLessonPage({
    params
}: {
    params: Promise<{ id: string, lessonId: string }>
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const { id: courseId, lessonId } = await params;

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
    });

    if (!lesson) notFound();

    // Get module and course for breadcrumb
    const module = await db.query.modules.findFirst({
        where: eq(modules.id, lesson.moduleId),
    });

    if (!module) notFound();

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    });

    if (!course) notFound();

    // If quiz, fetch questions
    let quizData = null;
    if (lesson.type === 'quiz') {
        const questions = await db.query.quizQuestions.findMany({
            where: eq(quizQuestions.lessonId, lessonId),
            orderBy: [asc(quizQuestions.order)],
            with: {
                options: {
                    orderBy: [asc(quizOptions.order)],
                }
            }
        });
        quizData = questions;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <a href={`/admin/courses/${courseId}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                    ← {course.title} に戻る
                </a>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                レッスン編集: {lesson.title}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                章: {module.title}
            </p>

            <LessonEditForm lesson={lesson as any} courseId={courseId} />

            {lesson.type === 'quiz' && (
                <div style={{ marginTop: '3rem' }}>
                    <QuizEditor lessonId={lessonId} initialQuestions={quizData as any} />
                </div>
            )}
        </div>
    );
}
