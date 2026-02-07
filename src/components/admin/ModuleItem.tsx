"use client";

import { useState } from "react";
import styles from "../../app/admin/courses/AdminCourses.module.css";
import { createLesson } from "@/actions/lesson";
import { useActionState } from "react";
import { Plus, Video, FileText, HelpCircle, ChevronDown, ChevronRight, Radio } from "lucide-react";

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

                <div>
                    <textarea name="description" placeholder="説明 (任意)" className={styles.textarea} rows={2} style={{ fontSize: '0.9rem' }}></textarea>
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

    console.log(`Module ${module.title} lessons:`, module.lessons);

    return (
        <div className={styles.moduleItem}>
            <div className={styles.moduleHeader} onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span style={{ fontWeight: 'bold' }}>{module.title}</span>
                    <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'normal' }}>({module.lessons.length} レッスン)</span>
                </div>
                <div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsAddingLesson(true); setIsExpanded(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        <Plus size={14} /> レッスン追加
                    </button>
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
