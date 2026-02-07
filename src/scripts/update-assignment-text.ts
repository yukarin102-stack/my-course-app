
import { db } from "../lib/db";
import { lessons } from "../db/schema";
import { eq, like } from "drizzle-orm";

async function main() {
    console.log("Searching for 'Test Assignment Manual'...");
    const results = await db.select().from(lessons).where(like(lessons.title, "%【課題】学習アウトプット提出%")).all(); // Title changed in previous step

    if (results.length === 0) {
        // Try searching by old title just in case
        const oldResults = await db.select().from(lessons).where(like(lessons.title, "%Test Assignment Manual%")).all();
        if (oldResults.length > 0) {
            await updateLesson(oldResults[0]);
            return;
        }
        console.log("No lesson found.");
        return;
    }

    await updateLesson(results[0]);
}

async function updateLesson(lesson: any) {
    console.log(`Found lesson: ID=${lesson.id}, Title='${lesson.title}'`);

    // ### などを削除し、プレーンテキストで見やすい形式にする
    const newDescription = `
課題内容
先ほどの「【テキスト版】ライブレッスンアーカイブ」を読み、学んだことや気づきを以下のアウトプット欄に記入して提出してください。

アウトプットのポイント
1. 自分のビジネスやチャンネルにどう活かせるか？
2. 具体的に明日から始めるアクションは何か？
3. 分からなかった点やもっと知りたい点は？

この課題は講師が確認し、フィードバックを行う場合があります。
しっかりと自分の言葉でまとめてみましょう。
    `.trim();

    await db.update(lessons)
        .set({
            description: newDescription
        })
        .where(eq(lessons.id, lesson.id));

    console.log("Lesson description updated successfully.");
}

main();
