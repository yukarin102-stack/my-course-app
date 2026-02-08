"use client";

import { useActionState } from "react";
import { submitAssignment } from "@/actions/assignment";
import { FileText, Send, CheckCircle, AlertCircle } from "lucide-react";

type Submission = {
    id: string;
    content: string | null;
    fileUrl: string | null;
    status: "submitted" | "graded" | "returned";
    grade: number | null;
    feedback: string | null;
    updatedAt: Date | null;
};

export default function AssignmentPlayer({
    lessonId,
    courseId,
    title,
    description,
    submission
}: {
    lessonId: string,
    courseId: string,
    title: string,
    description?: string | null,
    submission?: Submission | null
}) {
    const [state, formAction] = useActionState(submitAssignment, null);

    const isGraded = submission?.status === 'graded';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>📑 課題: {title}</h2>
                <div
                    style={{
                        color: '#000',
                        lineHeight: '1.8',
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        whiteSpace: 'pre-wrap',
                        fontFamily: '"Yu Gothic", "YuGothic", sans-serif'
                    }}
                    dangerouslySetInnerHTML={{ __html: description || '' }}
                />
            </div>

            {submission && (
                <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 'bold' }}>提出状況</h3>
                        <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            backgroundColor: isGraded ? '#059669' : '#d97706',
                            color: 'white'
                        }}>
                            {isGraded ? "添削済み" : "提出済み"}
                        </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>提出内容:</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{submission.content || "(テキストなし)"}</div>
                    </div>
                    {submission.fileUrl && (
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>添付URL:</div>
                            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>{submission.fileUrl}</a>
                        </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        提出日時: {submission.updatedAt ? new Date(submission.updatedAt).toLocaleString('ja-JP') : '-'}
                    </div>

                    {isGraded && (
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #4b5563' }}>
                            <h4 style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>先生からのフィードバック</h4>
                            {submission.grade !== null && (
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    評価: <span style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{submission.grade}</span> / 100
                                </div>
                            )}
                            <div style={{ backgroundColor: '#064e3b', padding: '1rem', borderRadius: '4px', lineHeight: '1.6' }}>
                                {submission.feedback}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isGraded && (
                <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{submission ? "再提出する" : "課題を提出する"}</h3>
                    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="hidden" name="lessonId" value={lessonId} />
                        <input type="hidden" name="courseId" value={courseId} />

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>回答テキスト</label>
                            <textarea
                                name="content"
                                rows={15}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#333',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    fontFamily: '"Yu Gothic", "YuGothic", sans-serif'
                                }}
                                placeholder="回答をここに入力してください..."
                                defaultValue={submission?.content || ""}
                            />
                        </div>

                        {/* URL input removed as per user request */}
                        <input type="hidden" name="fileUrl" value="" />

                        {state?.error && (
                            <div style={{ color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle size={16} /> {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div style={{ color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} /> 提出が完了しました
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                alignSelf: 'flex-start',
                                padding: '0.75rem 2rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Send size={16} /> {submission ? "更新して再提出" : "提出する"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
