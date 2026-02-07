import { TrendingUp, Users, Award, PlayCircle, Smartphone, Infinity } from "lucide-react";
import styles from "./Features.module.css";

const features = [
    {
        icon: TrendingUp,
        title: "最短で収益化達成",
        description: "無駄な回り道をせず、最短距離で収益化条件をクリアするための戦略的なロードマップを提供します。",
    },
    {
        icon: PlayCircle,
        title: "実践的動画編集スキル",
        description: "初心者でもプロ並みの動画が作れるようになる、Premiere Proの実践的な編集テクニックを伝授。",
    },
    {
        icon: Award,
        title: "プロの台本作成術",
        description: "視聴維持率を劇的に向上させる、プロユースの台本テンプレートと作成ノウハウ。",
    },
    {
        icon: Users,
        title: "ファン化マーケティング",
        description: "ただ再生されるだけでなく、濃いファンを獲得しビジネスにつなげるためのマーケティング理論。",
    },
    {
        icon: Smartphone,
        title: "スマホ視聴完全対応",
        description: "通勤中や隙間時間にも学習できるよう、すべてのコンテンツはスマホでの視聴に最適化されています。",
    },
    {
        icon: Infinity,
        title: "無期限の視聴アクセス",
        description: "一度購入すれば視聴期限はありません。いつでも好きな時に復習ができ、学習ペースもあなたの自由です。",
    },
];

export function Features() {
    return (
        <section id="features" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>選ばれる6つの理由</h2>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <feature.icon size={32} />
                            </div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
