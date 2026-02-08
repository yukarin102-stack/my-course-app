"use client";

import { useState, useTransition, useRef } from "react";
import styles from "../../app/admin/courses/AdminCourses.module.css";
import { createLesson } from "@/actions/lesson";
import { deleteModule, updateModule } from "@/actions/module";
import { useActionState } from "react";
import { Plus, Video, FileText, HelpCircle, ChevronDown, ChevronRight, Radio, Trash2, Pencil, Check, X } from "lucide-react";

type Lesson = {
    id: string;
    title: string;
    type: "video" | "text" | "quiz" | "live" | "assignment";
};

type ModuleProps = {
    module: {
        id: string;
        title: string;
        courseId: string;
        lessons: Lesson[];
    };
};

function AddLessonForm({ moduleId, courseId, onCancel }: { moduleId: string, courseId: string, onCancel: () => void }) {
    const [state, formAction] = useActionState(createLesson, null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
            <h5 style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>レッスン追加</h5>
            {state?.error && <div className={styles.error} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>{state.error}</div>}
            <form action={formAction} className={styles.form} style={{ gap: '0.75rem' }}>
                <input type="hidden" name="moduleId" value={moduleId} />
                <input type="hidden" name="courseId" value={courseId} />

                <div>
                    <input type="text" name="title" placeholder="レッスンタイトル" className={styles.input} style={{ width: '100%', fontSize: '0.9rem' }} required />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select name="type" className={styles.input} style={{ fontSize: '0.9rem' }}>
                        <option value="video">動画</option>
                        <option value="text">テキスト</option>
                        <option value="quiz">クイズ</option>
                        <option value="live">ライブ配信</option>
                        <option value="assignment">課題提出</option>
                    </select>
                    <input type="text" name="videoUrl" placeholder="Youtube動画ID (任意)" className={styles.input} style={{ flex: 1, fontSize: '0.9rem' }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" name="attachmentName" placeholder="資料名 (任意)" className={styles.input} style={{ flex: 1, fontSize: '0.9rem' }} />
                    <input type="text" name="attachmentUrl" placeholder="資料URL (Google Drive等)" className={styles.input} style={{ flex: 2, fontSize: '0.9rem' }} />
                </div>

                <div>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={() => {
                                const textarea = textareaRef.current;
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
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                            title="太字"
                        >
                            B
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const textarea = textareaRef.current;
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
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                            title="下線"
                        >
                            U
                        </button>
                    </div>
                    <textarea ref={textareaRef} name="description" placeholder="説明 (任意)" className={styles.textarea} rows={4} style={{ fontSize: '0.9rem' }}></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={onCancel} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>キャンセル</button>
                    <button type="submit" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>追加</button>
                </div>
            </form>
        </div>
    );
}

export default function ModuleItem({ module }: ModuleProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(module.title);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm(`「${module.title}」を削除してもよろしいですか？\n含まれるレッスンも全て削除されます。`)) {
            return;
        }
        startTransition(async () => {
            const result = await deleteModule(module.id);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    const handleUpdate = () => {
        if (!editTitle.trim()) {
            alert("タイトルは必須です");
            return;
        }
        startTransition(async () => {
            const result = await updateModule(module.id, editTitle);
            if (result.error) {
                alert(result.error);
            } else {
                setIsEditing(false);
            }
        });
    };

    return (
        <div className={styles.moduleItem}>
            <div className={styles.moduleHeader} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }} onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={styles.input}
                            style={{ fontSize: '0.9rem', padding: '0.25rem 0.5rem', width: '200px' }}
                            autoFocus
                        />
                    ) : (
                        <>
                            <span style={{ fontWeight: 'bold' }}>{module.title}</span>
                            <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>({module.lessons.length} レッスン)</span>
                        </>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                disabled={isPending}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer' }}
                            >
                                <Check size={14} /> {isPending ? "保存中..." : "保存"}
                            </button>
                            <button
                                onClick={() => { setIsEditing(false); setEditTitle(module.title); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                <X size={14} /> キャンセル
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                <Pencil size={14} /> 編集
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                disabled={isPending}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer' }}
                            >
                                <Trash2 size={14} /> {isPending ? "削除中..." : "削除"}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsAddingLesson(true); setIsExpanded(true); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                <Plus size={14} /> レッスン追加
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div style={{ padding: '0.5rem 1rem 1rem 1rem', backgroundColor: 'white' }}>
                    {module.lessons.length === 0 && !isAddingLesson && (
                        <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic', padding: '0.5rem 0' }}>レッスンがありません</p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {module.lessons.map(lesson => (
                            <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '4px' }}>
                                {lesson.type === 'video' ? <Video size={16} color="#666" /> :
                                    lesson.type === 'quiz' ? <HelpCircle size={16} color="#666" /> :
                                        lesson.type === 'live' ? <Radio size={16} color="#e11d48" /> :
                                            lesson.type === 'assignment' ? <FileText size={16} color="#2563eb" /> :
                                                <FileText size={16} color="#666" />}
                                <span style={{ fontSize: '0.9rem', flex: 1 }}>{lesson.title}</span>
                                {lesson.type === 'assignment' && (
                                    <a href={`/admin/courses/${module.courseId}/assignments/${lesson.id}`} style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', marginRight: '0.5rem' }}>添削一覧</a>
                                )}
                                <a href={`/admin/courses/${module.courseId}/lessons/${lesson.id}`} style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>編集</a>
                            </div>
                        ))}
                    </div>

                    {isAddingLesson && (
                        <AddLessonForm
                            moduleId={module.id}
                            courseId={module.courseId}
                            onCancel={() => setIsAddingLesson(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
