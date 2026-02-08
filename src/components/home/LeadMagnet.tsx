"use client";

import { useState } from "react";
import styles from "./LeadMagnet.module.css";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { subscribeLead } from "@/actions/lead";

export function LeadMagnet() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const formData = new FormData();
            formData.append("email", email);

            const result = await subscribeLead(formData);

            if (result.success) {
                setStatus("success");
                setMessage(result.message || "送信完了しました。");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(result.error || "エラーが発生しました。");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage("通信エラーが発生しました。");
        }
    };

    return (
        <section className={styles.section} id="free-guide">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.textContent}>
                        <div className={styles.badge}>無料プレゼント</div>
                        <h2 className={styles.title}>
                            「学習効率最大化の教科書」<br />
                            完全版PDFを無料配布中
                        </h2>
                        <p className={styles.description}>
                            累計1万回以上ダウンロードされた、これから学習を本格化する人のためのバイブル。<br />
                            目標設定から学習計画、記憶の定着メカニズムまでを70ページ超のPDFにまとめました。
                        </p>
                        <ul className={styles.benefits}>
                            <li><CheckCircle size={20} className={styles.icon} /> 挫折しやすい3つのポイントと対策</li>
                            <li><CheckCircle size={20} className={styles.icon} /> 自分に合った学習スタイル診断</li>
                            <li><CheckCircle size={20} className={styles.icon} /> 科学的に正しい復習タイミング完全ガイド</li>
                        </ul>
                    </div>

                    <div className={styles.formCard}>
                        {status === "success" ? (
                            <div className={styles.successState}>
                                <CheckCircle size={48} className={styles.successIcon} />
                                <h3 className={styles.successTitle}>登録完了！</h3>
                                <p>{message}</p>
                                <button
                                    className={styles.resetButton}
                                    onClick={() => setStatus("idle")}
                                >
                                    他のメールアドレスで受け取る
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3 className={styles.formTitle}>今すぐ無料で受け取る</h3>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>メールアドレス</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        placeholder="example@email.com"
                                        className={styles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={status === "loading"}
                                    />
                                </div>

                                {status === "error" && (
                                    <div className={styles.errorMessage}>
                                        <AlertCircle size={16} /> {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? "処理中..." : (
                                        <>
                                            <Download size={20} /> 無料ダウンロード
                                        </>
                                    )}
                                </button>
                                <p className={styles.privacyNote}>
                                    ※ご入力いただいたメールアドレスに、当スクールの最新情報をお届けすることがあります。いつでも解除可能です。
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
