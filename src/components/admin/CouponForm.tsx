"use client";

import { useActionState } from "react";
import { createCoupon } from "@/actions/marketing";
import styles from "../../app/admin/courses/AdminCourses.module.css";
import { useEffect, useRef } from "react";

export default function CouponForm() {
    const [state, formAction] = useActionState(createCoupon, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>新規クーポン発行</h3>
            {state?.error && <p className={styles.error} style={{ marginBottom: '1rem' }}>{state.error}</p>}

            <form ref={formRef} action={formAction} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>クーポンコード (英数字)</label>
                    <input type="text" name="code" placeholder="WELCOME2024" className={styles.input} required />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>割引額 (円)</label>
                    <input type="number" name="discountAmount" placeholder="1000" className={styles.input} min="1" required />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>使用回数上限 (任意)</label>
                    <input type="number" name="maxUses" placeholder="制限なし" className={styles.input} min="1" />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>有効期限 (任意)</label>
                    <input type="date" name="expiresAt" className={styles.input} />
                </div>
                <div>
                    <button type="submit" className={styles.submitButton} style={{ width: '100%' }}>発行する</button>
                </div>
            </form>
        </div>
    );
}
