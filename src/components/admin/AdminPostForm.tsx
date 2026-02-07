"use client";

import { useActionState } from "react";
import { createPost } from "@/actions/community";
import { MessageSquare } from "lucide-react";

const initialState = { success: false, error: "" };

export default function AdminPostForm({ courseId }: { courseId: string }) {
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        formData.append("courseId", courseId);
        return await createPost(formData);
    }, initialState);

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                <MessageSquare size={20} style={{ marginRight: '0.5rem' }} />
                新規投稿を作成
            </h3>

            <form action={formAction}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>タイトル</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="例: 今週の課題について"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>内容</label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        placeholder="投稿内容を入力..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        投稿する
                    </button>
                    {state?.success && <span style={{ color: '#16a34a' }}>投稿しました！</span>}
                    {state?.error && <span style={{ color: '#dc2626' }}>{state.error}</span>}
                </div>
            </form>
        </div>
    );
}
