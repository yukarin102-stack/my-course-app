"use client";

import { useActionState, useEffect } from "react";
// Note: If useActionState is not available yet in the installed versions, use useFormState from react-dom
import { useFormStatus } from "react-dom";
import styles from "./Enroll.module.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { enrollCourse } from "@/actions/enroll";
import { useRouter } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? "処理中..." : "購入を確定する"}
        </button>
    );
}

export default function EnrollPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [state, formAction] = useActionState(enrollCourse, null);

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard?enrolled=true");
        }
    }, [state, router]);

    return (
        <>
            <Header />
            <main className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>講座の申し込み</h1>
                    <p className={styles.description}>
                        以下の内容で講座の購入手続きを行います。<br />
                        （※デモ版のため、実際の決済は行われません）
                    </p>

                    <div className={styles.summary}>
                        <div className={styles.row}>
                            <span>コース名:</span>
                            <strong>Youtube完全攻略マスターコース</strong>
                        </div>
                        <div className={styles.row}>
                            <span>価格:</span>
                            <strong>¥29,800</strong>
                        </div>
                    </div>

                    {state?.error && <div className={styles.error}>{state.error}</div>}

                    <form action={formAction} className={styles.form}>
                        <input type="hidden" name="courseId" value={params.id} />

                        {/* Simulation of payment fields */}
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>カード番号 (デモ用: 任意の番号)</label>
                            <input type="text" className={styles.input} placeholder="0000 0000 0000 0000" />
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>有効期限</label>
                                <input type="text" className={styles.input} placeholder="MM/YY" />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CVC</label>
                                <input type="text" className={styles.input} placeholder="123" />
                            </div>
                        </div>

                        <SubmitButton />
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
