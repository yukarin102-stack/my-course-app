"use client";

import { useState } from "react";
import { PlayCircle, FileText, CheckCircle } from "lucide-react";
import styles from "./Curriculum.module.css";
import { MYASP_CONFIG } from "@/config/myasp";

const curriculum = [
    {
        title: "第0章: Youtube成功への土台作り - 戦略とマインドセット",
        lessons: [
            { title: "あなただけの「成功」を定義する", type: "video", duration: "10:00" },
            { title: "「数字の奴隷」にならないためのマインドセット", type: "video", duration: "12:00" },
            { title: "なぜ、9割の人がYoutubeで挫折するのか？", type: "video", duration: "15:00" },
        ],
    },
    {
        title: "第1章: イメージ戦略｜Youtubeで何を届けたいのか",
        lessons: [
            { title: "コンセプト設計とブランディング", type: "video", duration: "18:00" },
            { title: "あなたはどの役？3つの役柄", type: "video", duration: "14:00" },
            { title: "Youtubeアルゴリズム概論", type: "video", duration: "20:00" },
        ],
    },
    {
        title: "第2章: チャンネル成長の基本",
        lessons: [
            { title: "Youtubeの始め方（完全ガイド）", type: "video", duration: "25:00" },
            { title: "公開前チェックリスト", type: "text", duration: "5分" },
            { title: "あなたの「好き」を「資産」に変える12の戦略", type: "video", duration: "22:00" },
        ],
    },
    {
        title: "第3章: 「大きな反響」を生み出す企画とコンテンツ制作",
        lessons: [
            { title: "アイデアが枯渇したあなたを救う秘策", type: "video", duration: "15:00" },
            { title: "詳細な分析予測：再生数を予測する", type: "video", duration: "18:00" },
            { title: "Geminiで話題をさらうYoutube台本作成法", type: "video", duration: "20:00" },
            { title: "VidIQを使ったリサーチ術", type: "video", duration: "12:00" },
            { title: "競合調査とキーワードリサーチ", type: "video", duration: "16:00" },
        ],
    },
    {
        title: "第4章: 再生数とクリック率を最大化する技術",
        lessons: [
            { title: "SEOを意識したタイトルの付け方", type: "video", duration: "14:00" },
            { title: "クリックされやすいサムネイルの法則", type: "video", duration: "18:00" },
            { title: "再生数を劇的に伸ばす鍵", type: "video", duration: "15:00" },
            { title: "2026年のSEO最新戦略：AEOとエンティティ最適化", type: "video", duration: "20:00" },
        ],
    },
    {
        title: "第5章: 登録者1000人〜10000人へのロードマップ",
        lessons: [
            { title: "0→1000人の壁を越えるロードマップ", type: "video", duration: "22:00" },
            { title: "1000人〜10000人までのロードマップ", type: "video", duration: "25:00" },
            { title: "ショート動画戦略（2026年完全版）", type: "video", duration: "18:00" },
        ],
    },
    {
        title: "第6章: データ分析によるチャンネル改善",
        lessons: [
            { title: "アナリティクスの見方と活用法", type: "video", duration: "20:00" },
            { title: "最重要指標「CTR」と「平均視聴時間」", type: "video", duration: "15:00" },
            { title: "PDCAサイクル完全ガイド", type: "video", duration: "18:00" },
        ],
    },
    {
        title: "第7章: プラットフォーム機能とYMYL/E-E-A-T",
        lessons: [
            { title: "公式ヘルプ活用法", type: "text", duration: "10分" },
            { title: "YMYLの重要性とE-E-A-T対策", type: "video", duration: "20:00" },
            { title: "Youtubeの未来予測", type: "video", duration: "15:00" },
        ],
    },
];

export function Curriculum() {
    // MYASP決済URL（実際のURL）
    const myaspUrl = MYASP_CONFIG.paymentUrl;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 最初3つ（0,1,2章）だけ表示
    const displayedCurriculum = curriculum.slice(0, 3);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <section id="curriculum" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>文章で読む</h2>
                <div className={styles.moduleList}>
                    {displayedCurriculum.map((module, index) => (
                        <div key={index} className={styles.moduleCard}>
                            <div className={styles.moduleHeader}>
                                <h3 className={styles.moduleTitle}>{module.title}</h3>
                            </div>
                            <ul className={styles.lessonList}>
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <li key={lessonIndex} className={styles.lessonItem}>
                                        {lesson.type === "video" ? (
                                            <PlayCircle size={18} className={styles.lessonIcon} />
                                        ) : (
                                            <FileText size={18} className={styles.lessonIcon} />
                                        )}
                                        <span>{lesson.title}</span>
                                        <span className={styles.duration}>{lesson.duration}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* 全カリキュラムを見るボタン */}
                <div className={styles.viewAllContainer}>
                    <button onClick={toggleModal} className={styles.viewAllButton}>
                        全カリキュラムを見る
                    </button>
                </div>

                {/* MYASP申込ボタン */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <a
                        href={myaspUrl}
                        style={{
                            display: 'inline-block',
                            padding: '1.25rem 4rem',
                            backgroundColor: '#4169e1', /* ロイヤルブルーに近い色 */
                            background: 'linear-gradient(to bottom, #4f74e8, #3759c4)', /* 立体感を出すグラデーション */
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 0 #27408b, 0 8px 10px rgba(0,0,0,0.2)', /* 下部の立体的な影 */
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            position: 'relative',
                            top: '0'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'brightness(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'brightness(1)';
                            e.currentTarget.style.top = '0';
                            e.currentTarget.style.boxShadow = '0 4px 0 #27408b, 0 8px 10px rgba(0,0,0,0.2)';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.top = '4px';
                            e.currentTarget.style.boxShadow = '0 0 0 #27408b, 0 4px 6px rgba(0,0,0,0.1)';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.top = '0';
                            e.currentTarget.style.boxShadow = '0 4px 0 #27408b, 0 8px 10px rgba(0,0,0,0.2)';
                        }}
                    >
                        今すぐ講座に参加する
                    </a>
                    <p style={{ marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                        ※MYASPの決済ページに移動します
                    </p>
                </div>
            </div>

            {/* モーダル */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={toggleModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={toggleModal}>×</button>
                        <h2 className={styles.modalTitle}>全7章 完全カリキュラム</h2>

                        <div className={styles.modalBody}>
                            <h3 className={styles.modalSectionTitle}>カリキュラム構成</h3>
                            <ul className={styles.modalList}>
                                <li>はじめに</li>
                                <li>第0章：Youtube成功への土台作り - 戦略とマインドセット</li>
                                <li>第1章：イメージ戦略｜Youtubeで何を届けたいのか</li>
                                <li>第2章：チャンネル成長の基本</li>
                                <li>第3章：「大きな反響」を生み出す企画とコンテンツ制作</li>
                                <li>第4章：再生数とクリック率を最大化する技術</li>
                                <li>第5章：登録者1000人〜10000人へのロードマップ</li>
                                <li>第6章：データ分析によるチャンネル改善</li>
                                <li>第7章：プラットフォーム機能とYMYL/E-E-A-T</li>
                                <li>★2026年2月追加・更新セクション</li>
                            </ul>

                            <h3 className={styles.modalSectionTitleLarge}>はじめに：なぜYoutubeが最強のSNSなのか？</h3>
                            <p className={styles.modalText}>
                                「毎日SNSを更新しているのに、手応えがない…」「InstagramやXの投稿は、すぐにタイムラインに流れて消えてしまう…」そんな悩みを抱えていませんか？<br /><br />
                                Youtubeの最大の特徴は、投稿した動画が「資産」として積み上がっていくことです。一度投稿した動画は、あなたが寝ている間も、遊んでいる間も、24時間365日働き続け、新しいファンを連れてきてくれます。<br /><br />
                                このコースでは、登録者ゼロからスタートし、着実にファンを増やし、Youtubeを収益化するための具体的なステップを余すことなくお伝えします。
                            </p>

                            {/* 詳細な各章の内容を追加 */}
                            <div className={styles.modalDetails}>
                                {curriculum.map((module, idx) => (
                                    <div key={idx} className={styles.modalModule}>
                                        <h4 className={styles.modalModuleTitle}>{module.title}</h4>
                                        <ul className={styles.modalLessonList}>
                                            {module.lessons.map((lesson, lIdx) => (
                                                <li key={lIdx}>{lesson.title}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button onClick={toggleModal} className={styles.modalCloseButton}>
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
