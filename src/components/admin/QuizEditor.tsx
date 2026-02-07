"use client";

import { useState } from "react";
import { updateQuizQuestions } from "@/actions/lesson";
import { Plus, Trash2 } from "lucide-react";

type Option = {
    optionText: string;
    isCorrect: boolean;
    order: number;
};

type Question = {
    questionText: string;
    order: number;
    options: Option[];
};

export default function QuizEditor({
    lessonId,
    initialQuestions
}: {
    lessonId: string,
    initialQuestions: any[]
}) {
    const [questions, setQuestions] = useState<Question[]>(
        initialQuestions.length > 0
            ? initialQuestions.map((q, idx) => ({
                questionText: q.questionText,
                order: idx + 1,
                options: q.options.map((opt: any, optIdx: number) => ({
                    optionText: opt.optionText,
                    isCorrect: opt.isCorrect,
                    order: optIdx + 1,
                }))
            }))
            : []
    );
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const addQuestion = () => {
        setQuestions([...questions, {
            questionText: "",
            order: questions.length + 1,
            options: [
                { optionText: "", isCorrect: true, order: 1 },
                { optionText: "", isCorrect: false, order: 2 },
            ]
        }]);
    };

    const removeQuestion = (index: number) => {
        const updated = questions.filter((_, idx) => idx !== index);
        setQuestions(updated.map((q, idx) => ({ ...q, order: idx + 1 })));
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const addOption = (questionIndex: number) => {
        const updated = [...questions];
        updated[questionIndex].options.push({
            optionText: "",
            isCorrect: false,
            order: updated[questionIndex].options.length + 1,
        });
        setQuestions(updated);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updated = [...questions];
        updated[questionIndex].options = updated[questionIndex].options.filter((_, idx) => idx !== optionIndex);
        updated[questionIndex].options = updated[questionIndex].options.map((opt, idx) => ({ ...opt, order: idx + 1 }));
        setQuestions(updated);
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: any) => {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex] = { ...updated[questionIndex].options[optionIndex], [field]: value };
        setQuestions(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const result = await updateQuizQuestions(lessonId, questions);
        setSaving(false);
        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'クイズを保存しました' });
        }
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>クイズエディタ</h2>

            {message && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#dc2626',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {message.text}
                </div>
            )}

            {questions.map((question, qIdx) => (
                <div key={qIdx} style={{ marginBottom: '2rem', padding: '1.5rem', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 'bold' }}>問題 {qIdx + 1}</h3>
                        <button
                            onClick={() => removeQuestion(qIdx)}
                            style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>問題文</label>
                        <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                            placeholder="問題文を入力..."
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>選択肢</label>
                        {question.options.map((option, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={option.isCorrect}
                                    onChange={(e) => updateOption(qIdx, optIdx, 'isCorrect', e.target.checked)}
                                    title="正解"
                                />
                                <input
                                    type="text"
                                    value={option.optionText}
                                    onChange={(e) => updateOption(qIdx, optIdx, 'optionText', e.target.value)}
                                    placeholder={`選択肢 ${optIdx + 1}`}
                                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                                />
                                {question.options.length > 2 && (
                                    <button
                                        onClick={() => removeOption(qIdx, optIdx)}
                                        style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => addOption(qIdx)}
                            style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={16} /> 選択肢を追加
                        </button>
                    </div>
                </div>
            ))}

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={addQuestion}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                >
                    <Plus size={18} /> 問題を追加
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {saving ? '保存中...' : 'クイズを保存'}
                </button>
            </div>
        </div>
    );
}
