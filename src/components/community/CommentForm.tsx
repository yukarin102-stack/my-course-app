"use client";

import { useState } from "react";
import { createComment } from "@/actions/community";

export default function CommentForm({ postId, courseId }: { postId: string, courseId: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState("");

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        formData.append("postId", postId);
        formData.append("courseId", courseId);

        const result = await createComment(formData);
        setIsSubmitting(false);

        if (result?.error) {
            alert(result.error);
        } else {
            setContent(""); // Clear form
        }
    }

    return (
        <form action={handleSubmit} style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
            <h3 style={{ color: 'white', marginTop: 0 }}>コメントを投稿</h3>
            <div style={{ marginBottom: '1rem' }}>
                <textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="ここにコメントを入力..."
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#222',
                        border: '1px solid #444',
                        color: 'white',
                        borderRadius: '4px',
                        minHeight: '100px',
                        resize: 'vertical'
                    }}
                />
            </div>
            <div style={{ textAlign: 'right' }}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '0.8rem 1.5rem',
                        background: '#0070f3',
                        border: 'none',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isSubmitting ? '送信中...' : 'コメントする'}
                </button>
            </div>
        </form>
    );
}
