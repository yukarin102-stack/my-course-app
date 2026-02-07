"use client";

import { useState } from "react";
import { createPost } from "@/actions/community";
import styles from "../../app/courses/[id]/community/Community.module.css";
// Note: importing styles from app dir is allowed in Next.js if configured or using relative path correctly.
// Ideally shared styles or component specific module.
// Let's assume the relative path works or we can duplicate. 
// Actually for components better to have their own css or use global utility. 
// I'll stick to using the one I just made via relative import for speed, 
// or I can make `CreatePostForm.module.css` if that fails.
// Relative path to app dir is brittle.
// I will expect to invoke this component from the page, maybe render Form inline?
// No, better as client component.
// I will use inline styles or pass className for simplicity or create `CreatePostForm.module.css`.
// Let's create `src/components/community/Community.module.css` (shared) instead of putting it in app?
// I put it in `src/app/...` in previous step. 
// I'll just refer to it assuming structure `../../app/courses/[id]/community/Community.module.css`.

export default function CreatePostForm({ courseId, onClose }: { courseId: string, onClose: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        formData.append("courseId", courseId);

        const result = await createPost(formData);
        setIsSubmitting(false);

        if (result?.error) {
            alert(result.error);
        } else {
            onClose();
        }
    }

    return (
        <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0, color: 'white' }}>新規投稿を作成</h3>
            <form action={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>タイトル</label>
                    <input
                        name="title"
                        required
                        style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem' }}>内容</label>
                    <textarea
                        name="content"
                        required
                        style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px', minHeight: '100px' }}
                    />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ padding: '0.5rem 1rem', background: '#0070f3', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {isSubmitting ? '送信中...' : '投稿する'}
                    </button>
                </div>
            </form>
        </div>
    );
}
