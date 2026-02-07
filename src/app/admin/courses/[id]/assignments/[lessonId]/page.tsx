import { db } from "@/lib/db";
import { submissions, users, lessons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import GradingForm from "@/components/admin/GradingForm";

export default async function SubmissionsPage({ params }: { params: Promise<{ id: string, lessonId: string }> }) {
    const { id: courseId, lessonId } = await params;

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
    });

    if (!lesson) notFound();

    const allSubmissions = await db.select({
        submission: submissions,
        user: users,
    })
        .from(submissions)
        .innerJoin(users, eq(submissions.userId, users.id))
        .where(eq(submissions.lessonId, lessonId))
        .orderBy(desc(submissions.updatedAt));

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                課題提出一覧: {lesson.title}
            </h1>

            {allSubmissions.length === 0 ? (
                <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                    提出物はまだありません。
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {allSubmissions.map(({ submission, user }) => (
                        <div key={submission.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{user.name || user.email}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user.email}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        backgroundColor: submission.status === 'graded' ? '#059669' : '#d97706',
                                        color: 'white',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {submission.status === 'graded' ? "添削済み" : "未添削"}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                        {submission.updatedAt ? new Date(submission.updatedAt).toLocaleString('ja-JP') : '-'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>提出内容:</div>
                                <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px', whiteSpace: 'pre-wrap', marginBottom: '0.5rem' }}>
                                    {submission.content || "(テキストなし)"}
                                </div>
                                {submission.fileUrl && (
                                    <div>
                                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                                            📎 添付ファイルを開く
                                        </a>
                                    </div>
                                )}
                            </div>

                            <GradingForm submission={submission} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
