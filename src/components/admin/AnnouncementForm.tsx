"use client";

import { useActionState, useState } from "react";
import { createCourseAnnouncement } from "@/actions/announcement";
import { MessageSquare, Video } from "lucide-react";

const initialState = { success: false, error: "" };

export default function AnnouncementForm({ courseId }: { courseId?: string }) {
    // @ts-ignore
    const [state, formAction] = useActionState(createCourseAnnouncement, initialState);
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}
            >
                <MessageSquare size={20} style={{ marginRight: '0.5rem' }} />
                お知らせ・動画を投稿する
            </button>
        );
    }

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>お知らせ投稿</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>

            <form action={formAction}>
                <input type="hidden" name="courseId" value={courseId || ""} />

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>タイトル</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="例: 今週の学習ポイント"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>本文</label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        placeholder="受講生へのメッセージ..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Video size={16} style={{ marginRight: '0.5rem' }} />
                            動画ID (Youtube, 任意)
                        </div>
                    </label>
                    <input
                        type="text"
                        name="videoUrl"
                        placeholder="例: dQw4w9WgXcQ"
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
