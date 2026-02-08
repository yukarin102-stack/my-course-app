"use client";

import { useActionState } from "react";
import { createCourse } from "@/actions/course";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../AdminCourses.module.css";
import Link from "next/link"; // Changed from next/link to allow styling

export default function NewCoursePage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createCourse, null);

    useEffect(() => {
        if (state?.success && state.courseId) {
            router.push(`/admin/courses/${state.courseId}`);
        }
    }, [state, router]);

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.pageTitle}>新規講座作成</h1>

            {state?.error && <div className={styles.error}>{state.error}</div>}

            <form action={formAction} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>講座タイトル</label>
                    <input type="text" name="title" className={styles.input} required />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>説明</label>
                    <textarea name="description" className={styles.textarea} rows={5} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>価格 (円)</label>
                    <input type="number" name="price" className={styles.input} defaultValue={0} min={0} />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="published" />
                        <span>すぐに公開する</span>
                    </label>
                </div>

                <div className={styles.actions}>
                    <Link href="/admin/courses" className={styles.cancelButton}>キャンセル</Link>
                    <button type="submit" className={styles.submitButton} disabled={isPending}>
                        {isPending ? "作成中..." : "作成して編集へ進む"}
                    </button>
                </div>
            </form>
        </div>
    );
}
