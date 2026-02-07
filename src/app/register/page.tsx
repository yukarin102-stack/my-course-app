"use client";

import { useActionState } from "react"; // Next.js 15 / React 19 hook
// Note: If useActionState is not available yet in the installed versions, use useFormState from react-dom
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import styles from "@/components/auth/Auth.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? "登録中..." : "アカウント作成"}
        </button>
    );
}

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError(null);
        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/login?registered=true");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>新規登録</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form action={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>お名前</label>
                        <input id="name" name="name" type="text" required className={styles.input} placeholder="山田 太郎" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>メールアドレス</label>
                        <input id="email" name="email" type="email" required className={styles.input} placeholder="your@email.com" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>パスワード</label>
                        <input id="password" name="password" type="password" required className={styles.input} minLength={6} placeholder="6文字以上" />
                    </div>

                    <SubmitButton />
                </form>

                <p className={styles.linkText}>
                    すでにアカウントをお持ちの方は <Link href="/login" className={styles.link}>ログイン</Link>
                </p>
            </div>
        </div>
    );
}
