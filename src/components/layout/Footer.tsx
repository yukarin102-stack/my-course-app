import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3>Youtube Hacks</h3>
                        <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: "1.6" }}>
                            Youtubeノウハウを体系的に学べる<br />
                            オンライン学習プラットフォーム
                        </p>
                    </div>
                    <div className={styles.column}>
                        <h3>コンテンツ</h3>
                        <ul className={styles.links}>
                            <li><Link href="#features">特徴</Link></li>
                            <li><Link href="#curriculum">カリキュラム</Link></li>
                            <li><Link href="#pricing">料金</Link></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h3>サポート</h3>
                        <div className={styles.links}>
                            <h4>リンク</h4>
                            <ul>
                                <li><Link href="/">ホーム</Link></li>
                                <li><Link href="/courses">講座一覧</Link></li>
                                <li><Link href="/contact">お問い合わせ</Link></li>
                                <li><Link href="/terms">利用規約</Link></li>
                                <li><Link href="/privacy">プライバシーポリシー</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} Youtube Hacks. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
