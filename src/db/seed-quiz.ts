import { db } from "../lib/db";
import { lessons, quizQuestions, quizOptions, courses, modules } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Seeding quiz data...");

    // Find the first course and module (assuming created by initial seed)
    const course = await db.query.courses.findFirst();
    if (!course) {
        console.error("No course found. Run initial seed first.");
        return;
    }

    const mod = await db.query.modules.findFirst({
        where: eq(modules.courseId, course.id)
    });

    if (!mod) {
        console.error("No module found.");
        return;
    }

    // Create a Quiz Lesson
    const [quizLesson] = await db.insert(lessons).values({
        moduleId: mod.id,
        title: "理解度確認テスト",
        type: "quiz",
        order: 2, // After the first video lesson
        description: "第1章の内容をどれくらい理解できているか確認しましょう。",
    }).returning();

    console.log("Created quiz lesson:", quizLesson.id);

    // Question 1
    const [q1] = await db.insert(quizQuestions).values({
        lessonId: quizLesson.id,
        questionText: "Youtubeで最も重要な指標の一つとされる「視聴維持率」とは何ですか？",
        order: 1,
    }).returning();

    await db.insert(quizOptions).values([
        { questionId: q1.id, optionText: "動画がクリックされた回数", isCorrect: false, order: 1 },
        { questionId: q1.id, optionText: "動画が最後まで見られた割合（または平均再生時間）", isCorrect: true, order: 2 },
        { questionId: q1.id, optionText: "チャンネル登録者数が増えた数", isCorrect: false, order: 3 },
    ]);

    // Question 2
    const [q2] = await db.insert(quizQuestions).values({
        lessonId: quizLesson.id,
        questionText: "サムネイルの目的として最も適切なものはどれですか？",
        order: 2,
    }).returning();

    await db.insert(quizOptions).values([
        { questionId: q2.id, optionText: "動画の内容を全て説明する", isCorrect: false, order: 1 },
        { questionId: q2.id, optionText: "きれいに見せる", isCorrect: false, order: 2 },
        { questionId: q2.id, optionText: "ユーザーの興味を引き、クリックさせる", isCorrect: true, order: 3 },
    ]);

    console.log("Quiz data seeded successfully!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
