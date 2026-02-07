"use client";

import { useActionState } from "react";
import { updateCourse } from "@/actions/course";
import styles from "../../app/admin/courses/AdminCourses.module.css";
import Link from "next/link";

type Course = {
    id: string;
    title: string;
    description: string | null;
    price: number;
    published: boolean | null;
    thumbnailUrl: string | null;
};

export default function CourseEditForm({ course }: { course: Course }) {
    const updateCourseWithId = updateCourse.bind(null, course.id);
    const [state, formAction] = useActionState(updateCourseWithId, null);

    return (
        <>
            <div className={styles.headerActions}>
                <h1 className={styles.pageTitle}>講座編集: {course.title}</h1>
                <Link href="/admin/courses" className={styles.cancelButton}>一覧に戻る</Link>
            </div>

            {state?.error && <div className={styles.error}>{state.error}</div>}
            {state?.success && <div className={styles.error} style={{ backgroundColor: '#dcfce7', color: '#166534' }}>変更を保存しました</div>}

            <form action={formAction} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>講座タイトル</label>
                    <input type="text" name="title" className={styles.input} defaultValue={course.title} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>説明</label>
                    <textarea name="description" className={styles.textarea} rows={5} defaultValue={course.description || ""} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.label}>価格 (円)</label>
                        <input type="number" name="price" className={styles.input} defaultValue={course.price} min={0} />
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={styles.label}>サムネイル画像URL</label>
                        <input
                            type="text"
                            name="thumbnailUrl"
                            className={styles.input}
                            defaultValue={course.thumbnailUrl || ""}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {course.thumbnailUrl && (
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>プレビュー:</p>
                        <img
                            src={course.thumbnailUrl}
                            alt="Course thumbnail"
                            style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="published" defaultChecked={course.published || false} />
                        <span>公開する</span>
                    </label>
                </div>

                <div className={styles.actions} style={{ justifyContent: 'flex-start' }}>
                    <button type="submit" className={styles.submitButton}>変更を保存</button>
                </div>
            </form>
        </>
    );
}
