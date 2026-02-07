import styles from "./Instructor.module.css";

export function Instructor() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <div className={styles.image}>
                        {/* 
               TODO: Use generate_image or placeholder. 
               For now, simple div with bg color in CSS.
             */}
                    </div>
                </div>
                <div className={styles.content}>
                    <span className={styles.role}>講師プロフィール</span>
                    <h2 className={styles.name}>山田 太郎</h2>
                    <p className={styles.bio}>
                        元テレビ局ディレクター。2018年にYoutubeチャンネルを開設し、わずか1年で登録者10万人を達成。<br />
                        現在は自身のチャンネル運営に加え、企業のYoutube運用コンサルティングや映像制作スクールの講師としても活動中。<br />
                        「誰でもクリエイターになれる」をモットーに、論理的かつ実践的な指導に定評がある。
                    </p>
                    <div className={styles.achievements}>
                        <div className={styles.achievementItem}>📺 登録者数 10万人</div>
                        <div className={styles.achievementItem}>🎬 総再生数 2,000万回</div>
                        <div className={styles.achievementItem}>🎓 指導実績 500名以上</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
