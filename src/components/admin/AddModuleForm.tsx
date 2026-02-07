"use client";

import { useActionState } from "react";
import { createModule } from "@/actions/module";
import styles from "../../app/admin/courses/AdminCourses.module.css";
import { useEffect, useRef } from "react";

export default function AddModuleForm({ courseId }: { courseId: string }) {
    const [state, formAction] = useActionState(createModule, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>新しい章を追加</h4>
            {state?.error && <p className={styles.error} style={{ fontSize: '0.8rem', padding: '0.5rem', marginBottom: '0.5rem' }}>{state.error}</p>}

            <form ref={formRef} action={formAction} style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="hidden" name="courseId" value={courseId} />
                <input type="text" name="title" placeholder="章のタイトル (例: 第1章 基礎知識)" className={styles.input} style={{ flex: 1 }} required />
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>追加</button>
            </form>
        </div>
    );
}
