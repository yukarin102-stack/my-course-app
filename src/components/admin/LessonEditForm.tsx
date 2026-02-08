"use client";

import { useActionState, useRef, useState } from "react";
import { updateLesson } from "@/actions/lesson";

type Lesson = {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    attachmentUrl: string | null;
    attachmentName: string | null;
    type: "video" | "text" | "quiz" | "live" | "assignment";
    order: number;
    isFree: boolean | null;
};

export default function LessonEditForm({ lesson, courseId }: { lesson: Lesson, courseId: string }) {
    const updateLessonWithId = updateLesson.bind(null, lesson.id);
    const [state, formAction] = useActionState(updateLessonWithId, null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const [currentType, setCurrentType] = useState(lesson.type);

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
                        onChange={(e) => setCurrentType(e.target.value as any)}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                    >
                        <option value="video">動画</option>
                        <option value="text">テキスト</option>
                        <option value="quiz">クイズ</option>
                        <option value="live">ライブ配信</option>
                        <option value="assignment">課題提出</option>
                    </select>
                </div>

                {(currentType === 'video' || currentType === 'live') && (
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

                {currentType === 'text' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            テキスト内容
                        </label>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const textarea = descriptionRef.current;
                                    if (!textarea) return;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const text = textarea.value;
                                    const selectedText = text.substring(start, end);
                                    const newText = text.substring(0, start) + '<b>' + selectedText + '</b>' + text.substring(end);
                                    textarea.value = newText;
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 3, end + 3);
                                }}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                title="太字"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const textarea = descriptionRef.current;
                                    if (!textarea) return;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const text = textarea.value;
                                    const selectedText = text.substring(start, end);
                                    const newText = text.substring(0, start) + '<u>' + selectedText + '</u>' + text.substring(end);
                                    textarea.value = newText;
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 3, end + 3);
                                }}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                title="下線"
                            >
                                U
                            </button>
                        </div>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            defaultValue={lesson.description || ''}
                            rows={15}
                            placeholder="テキスト教材の内容を入力してください..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ボタンを押すとタグ（&lt;b&gt;など）が挿入されます。実際の表示で太字になります。
                        </p>
                    </div>
                )}

                {currentType === 'assignment' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            課題の説明
                        </label>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    const textarea = descriptionRef.current;
                                    if (!textarea) return;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const text = textarea.value;
                                    const selectedText = text.substring(start, end);
                                    const newText = text.substring(0, start) + '<b>' + selectedText + '</b>' + text.substring(end);
                                    textarea.value = newText;
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 3, end + 3);
                                }}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                                title="太字"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const textarea = descriptionRef.current;
                                    if (!textarea) return;
                                    const start = textarea.selectionStart;
                                    const end = textarea.selectionEnd;
                                    const text = textarea.value;
                                    const selectedText = text.substring(start, end);
                                    const newText = text.substring(0, start) + '<u>' + selectedText + '</u>' + text.substring(end);
                                    textarea.value = newText;
                                    textarea.focus();
                                    textarea.setSelectionRange(start + 3, end + 3);
                                }}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    backgroundColor: '#fff',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                title="下線"
                            >
                                U
                            </button>
                        </div>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            defaultValue={lesson.description || ''}
                            rows={10}
                            placeholder="課題の内容、提出方法、評価基準などを記載してください..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            ボタンを押すとタグ（&lt;b&gt;など）が挿入されます。実際の表示で太字になります。
                        </p>
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

                {/* 参考資料セクション（全タイプ共通） */}
                <div style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e3a5f' }}>📎 参考資料（任意）</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                            ファイル名（表示用）
                        </label>
                        <input
                            type="text"
                            name="attachmentName"
                            defaultValue={lesson.attachmentName || ''}
                            placeholder="例: 講義スライド.pdf、演習問題.xlsx"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                        />
                    </div>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                            ファイルURL（Google Drive / Dropbox 等）
                        </label>
                        <input
                            type="text"
                            name="attachmentUrl"
                            defaultValue={lesson.attachmentUrl || ''}
                            placeholder="例: https://drive.google.com/file/d/.../view"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: '"Yu Gothic", "YuGothic", sans-serif' }}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            Google Drive、Dropbox、OneDrive等のファイル共有リンクを入力してください。生徒がダウンロードできるようになります。
                        </p>
                    </div>
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
