"use client";

import { useActionState } from "react";
import { sendInquiry } from "@/actions/contact";
import styles from "./Contact.module.css";
import { useEffect, useRef } from "react";

export default function ContactForm() {
    const [state, formAction] = useActionState(sendInquiry, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    if (state?.success) {
        return (
            <div className={styles.successMessage}>
                <h3>送信完了</h3>
                <p>お問い合わせありがとうございます。内容を確認の上、担当者よりご連絡いたします。</p>
                <button
                    onClick={() => window.location.reload()}
                    className={styles.resetButton}
                >
                    新しい問い合わせを送る
                </button>
            </div>
        );
    }

    return (
        <form ref={formRef} action={formAction} className={styles.form}>
            {state?.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.formGroup}>
                <label htmlFor="name">お名前</label>
                <input type="text" id="name" name="name" className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">メールアドレス</label>
                <input type="email" id="email" name="email" className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="subject">件名</label>
                <input type="text" id="subject" name="subject" className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message">お問い合わせ内容</label>
                <textarea id="message" name="message" rows={6} className={styles.textarea} required></textarea>
            </div>

            <button type="submit" className={styles.submitButton}>送信する</button>
        </form>
    );
}
