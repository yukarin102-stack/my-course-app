import Link from "next/link";
import styles from "./Hero.module.css";
import { MYASP_CONFIG } from "@/config/myasp";

export function Hero() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>

                <h1 className={styles.title}>
                    Youtubeで<br />
                    <span className={styles.highlight}>あなたの知識を資産に変える</span><br />
                    最強のロードマップ
                </h1>

                <p className={styles.description}>
                    チャンネル登録者数10万人超えのノウハウを体系化。<br />
                    企画、撮影、編集、そして収益化まで、<br />
                    最短距離で成功するためのすべてがここにあります。
                </p>

                <div className={styles.actions}>
                    <a href={MYASP_CONFIG.paymentUrl} className={styles.primaryButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
                        今すぐ講座に参加する
                    </a>
                    <Link href="#curriculum">
                        <button className={styles.secondaryButton}>
                            カリキュラムを見る
                        </button>
                    </Link>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>10,000+</span>
                        <span className={styles.statLabel}>受講生数</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>4.9/5</span>
                        <span className={styles.statLabel}>平均評価</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>500+</span>
                        <span className={styles.statLabel}>動画コンテンツ</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
