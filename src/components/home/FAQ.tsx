import styles from "./FAQ.module.css";

const faqs = [
    {
        question: "動画編集の経験が全くありませんが、受講しても大丈夫ですか？",
        answer: "はい、全く問題ありません。本講座は完全初心者向けに作られており、ソフトのインストール方法から丁寧に解説しています。",
    },
    {
        question: "受講期間に制限はありますか？",
        answer: "いいえ、買い切り型の講座ですので、一度購入すれば無期限で視聴可能です。自分のペースで学習を進めることができます。",
    },
    {
        question: "スマホだけでも受講できますか？",
        answer: "動画講義の視聴はスマホだけでも可能です。ただし、動画編集の実践パートではPC（WindowsまたはMac）の使用を推奨しています。",
    },
    {
        question: "領収書の発行は可能ですか？",
        answer: "はい、購入後のマイページよりPDF形式の領収書をダウンロードいただけます。",
    },
];

export function FAQ() {
    return (
        <section id="faq" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>よくある質問</h2>
                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.faqItem}>
                            <div className={styles.question}>{faq.question}</div>
                            <div className={styles.answer}>{faq.answer}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
