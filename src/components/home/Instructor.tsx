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
                        元大手予備校講師。2018年にオンライン学習指導を開始し、わずか1年で受講生1万人を達成。<br />
                        現在は自身の学習プラットフォーム運営に加え、企業の教育研修コンサルティングや学習塾の講師としても活動中。<br />
                        「誰でも成果を出せる」をモットーに、論理的かつ実践的な指導に定評がある。
                    </p>
                    <div className={styles.achievements}>
                        <div className={styles.achievementItem}>🎓 受講生数 1万人</div>
                        <div className={styles.achievementItem}>📚 総学習時間 2,000万時間</div>
                        <div className={styles.achievementItem}>🏫 指導実績 500名以上</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
