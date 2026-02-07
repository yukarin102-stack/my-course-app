
import { db } from "../lib/db";
import { lessons } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const lessonId = "61665bf4-bdf2-4980-a5b4-cb57ef584771";
    console.log(`Updating lesson ${lessonId} to text format...`);

    const textContent = `
# ライブレッスンのアーカイブ（テキスト版）

このレッスンは、以前行われたライブレッスンの内容をテキスト形式でまとめたものです。
動画で視聴する時間が取れない方や、文字で要点を確認したい方向けのコンテンツです。

## 主なトピック

1. YouTubeアルゴリズムの最新動向
2. 視聴維持率を上げるための最初の15秒の作り方
3. クリック率（CTR）を高めるサムネイル作成のポイント

## 詳細解説

### 1. YouTubeアルゴリズムの最新動向
YouTubeのアルゴリズムは常に変化していますが、最も重要視される指標は「総再生時間」と「視聴者満足度」です。
単にクリックさせるだけでなく、どれだけ長く見てもらえたか、そして視聴後に「高評価」等のアクションがあったかが重要になります。

### 2. 最初の15秒の重要性
動画の離脱が最も多いのは開始15秒以内です。ここで「この動画は自分に関係ある」「面白そうだ」と思わせるフックが必要です。
結論から話す、インパクトのある映像を見せる、などのテクニックが有効です。

### 3. サムネイルのポイント
サムネイルは動画の「顔」です。
- 文字は大きく、少なく（15文字以内推奨）
- 感情が伝わる表情
- 補色を使った配色の工夫
これらを意識するだけでCTRは大きく改善します。

---
ご質問がある場合は、コミュニティまたは質問フォームからお送りください。
    `;

    await db.update(lessons)
        .set({
            type: "text",
            videoUrl: null, // 動画URLはクリア
            description: textContent.trim(),
            title: "【テキスト版】ライブレッスンアーカイブ" // タイトルも分かりやすく変更
        })
        .where(eq(lessons.id, lessonId));

    console.log("Lesson updated successfully.");
}

main();
