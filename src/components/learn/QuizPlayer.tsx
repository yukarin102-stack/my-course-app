"use client";

import { useState } from "react";
import styles from "./QuizPlayer.module.css";
import { CheckCircle, XCircle } from "lucide-react";
import { markLessonComplete } from "@/actions/progress";

type Option = {
    id: string;
    optionText: string;
    isCorrect: boolean;
};

type Question = {
    id: string;
    questionText: string;
    options: Option[];
};

export default function QuizPlayer({
    questions,
    lessonId,
    courseId,
    nextLessonId,
    initialCompleted
}: {
    questions: Question[],
    lessonId: string,
    courseId: string,
    nextLessonId?: string,
    initialCompleted: boolean
}) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(initialCompleted);
    const [score, setScore] = useState(0);

    const handleSelect = (questionId: string, optionId: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        let correctCount = 0;
        questions.forEach(q => {
            const selectedOptionId = answers[q.id];
            const correctOption = q.options.find(o => o.isCorrect);
            if (selectedOptionId === correctOption?.id) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setSubmitted(true);

        // Mark as complete regardless of score for now (completion = participation)
        const formData = new FormData();
        formData.append("lessonId", lessonId);
        formData.append("courseId", courseId);
        if (nextLessonId) formData.append("nextLessonId", nextLessonId);

        await markLessonComplete(formData);
    };

    const allAnswered = questions.every(q => answers[q.id]);

    return (
        <div className={styles.quizContainer}>
            {questions.map((q, index) => (
                <div key={q.id} className={styles.questionCard}>
                    <div className={styles.questionText}>
                        Q{index + 1}. {q.questionText}
                    </div>
                    <div className={styles.optionsList}>
                        {q.options.map((opt) => {
                            const isSelected = answers[q.id] === opt.id;
                            const isCorrectCSS = submitted && opt.isCorrect ? styles.correct : '';
                            const isIncorrectCSS = submitted && isSelected && !opt.isCorrect ? styles.incorrect : '';
                            const isDisabled = submitted ? styles.disabled : '';

                            return (
                                <label
                                    key={opt.id}
                                    className={`${styles.optionLabel} ${isSelected ? styles.selected : ''} ${isCorrectCSS} ${isIncorrectCSS} ${isDisabled}`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt.id}
                                        className={styles.radio}
                                        checked={isSelected}
                                        onChange={() => handleSelect(q.id, opt.id)}
                                        disabled={submitted}
                                        style={{ display: 'none' }}
                                    />
                                    {submitted && opt.isCorrect && <CheckCircle size={18} />}
                                    {submitted && isSelected && !opt.isCorrect && <XCircle size={18} />}
                                    {opt.optionText}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            {!submitted ? (
                <button
                    className={styles.checkButton}
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                >
                    回答を確認する
                </button>
            ) : (
                <div className={styles.results}>
                    <div className={styles.score}>
                        あなたの正解率: {score} / {questions.length}
                    </div>
                    <p>{score === questions.length ? "素晴らしい！全問正解です🎉" : "復習してもう一度チャレンジしてみましょう！"}</p>
                </div>
            )}
        </div>
    );
}
