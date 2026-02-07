"use client";

import { useActionState } from "react";
import { updateLesson } from "@/actions/lesson";

type Lesson = {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    type: "video" | "text" | "quiz" | "live" | "assignment";
    order: number;
    isFree: boolean | null;
};

export default function LessonEditForm({ lesson, courseId }: { lesson: Lesson, courseId: string }) {
    const updateLessonWithId = updateLesson.bind(null, lesson.id);
    const [state, formAction] = useActionState(updateLessonWithId, null);

    return (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {state?.error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem' }}>{state.error}</div>}
            {state?.success && <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: '1rem' }}>保存しました</div>}

            <form action={formAction}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>タイトル</label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={lesson.title}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>タイプ</label>
                    <select
                        name="type"
                        defaultValue={lesson.type}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                    >
                        <option value="video">動画</option>
                        <option value="text">テキスト</option>
                        <option value="quiz">クイズ</option>
                        <option value="live">ライブ配信</option>
                        <option value="assignment">課題提出</option>
                    </select>
                </div>

                {(lesson.type === 'video' || lesson.type === 'live') && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            動画URL または YouTube ID
                        </label>
                        <input
                            type="text"
                            name="videoUrl"
                            defaultValue={lesson.videoUrl || ''}
                            placeholder="例: dQw4w9WgXcQ または https://drive.google.com/..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            YouTube ID、Google Drive、Dropboxなどの共有リンクを入力できます
                        </p>
                        <div style={{ marginTop: '0.5rem' }}>
                            <a href="/admin/media" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'underline' }}>
                                データをアップロードする（別タブで開く）
                            </a>
                        </div>
                    </div>
                )}

                {lesson.type === 'text' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            テキスト内容
                        </label>
                        <textarea
                            name="description"
                            defaultValue={lesson.description || ''}
                            rows={15}
                            placeholder="テキスト教材の内容を入力してください..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            改行やマークダウン記法も使用できます
                        </p>
                    </div>
                )}

                {lesson.type === 'assignment' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            課題の説明
                        </label>
                        <textarea
                            name="description"
                            defaultValue={lesson.description || ''}
                            rows={10}
                            placeholder="課題の内容、提出方法、評価基準などを記載してください..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                )}

                {lesson.type === 'quiz' && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                        <p style={{ color: '#6b7280' }}>
                            クイズの問題は下の「クイズエディタ」で編集してください
                        </p>
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>順序</label>
                    <input
                        type="number"
                        name="order"
                        defaultValue={lesson.order}
                        min={1}
                        style={{ width: '100px', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="isFree"
                            defaultChecked={lesson.isFree || false}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <span>無料で公開（プレビュー）</span>
                    </label>
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    変更を保存
                </button>
            </form>
        </div>
    );
}
