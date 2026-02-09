"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { authenticate } from "@/actions/login";
import styles from "@/components/auth/Auth.module.css";
import { useActionState } from "react";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? "ログイン中..." : "ログイン"}
        </button>
    );
}

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { loginWithToken } from "@/actions/login";

function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [autoLoginError, setAutoLoginError] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            loginWithToken(token, callbackUrl).then((result) => {
                if (result?.error) {
                    setAutoLoginError("自動ログインに失敗しました。無効なトークンか、期限切れです。手動でログインしてください。");
                }
            });
        }
    }, [token, callbackUrl]);

    if (token && !autoLoginError) {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>ログイン中...</h2>
                    <p>アカウントを確認しています。</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>ログイン</h1>

                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                {autoLoginError && <div className={styles.error}>{autoLoginError}</div>}

                <form action={dispatch} className={styles.form}>
                    <input type="hidden" name="callbackUrl" value={callbackUrl || ""} />
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>メールアドレス</label>
                        <input id="email" name="email" type="email" required className={styles.input} placeholder="your@email.com" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>パスワード</label>
                        <input id="password" name="password" type="password" required className={styles.input} />
                    </div>

                    <LoginButton />
                </form>

                <p className={styles.linkText}>
                    アカウントをお持ちでない方は <Link href="/register" className={styles.link}>新規登録</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
