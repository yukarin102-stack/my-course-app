"use client";

import { PlayCircle, MessageSquare } from "lucide-react";

type Announcement = {
    id: string;
    title: string;
    content: string;
    videoUrl?: string | null;
    createdAt: Date | null;
};

export default function CourseHome({ courseTitle, announcements }: { courseTitle: string, announcements: Announcement[] }) {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem 2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                marginBottom: '3rem',
                textAlign: 'center',
                background: 'linear-gradient(to right bottom, #3b82f6, #1d4ed8)',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{courseTitle}</h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>学習を始めましょう！左のメニューからレッスンを選択してください。</p>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', color: '#000' }}>
                <MessageSquare style={{ marginRight: '0.75rem', color: '#4f46e5' }} />
                お知らせ・最新情報
            </h2>

            {announcements.length === 0 ? (
                <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                    まだお知らせはありません。
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {announcements.map(item => (
                        <div key={item.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 4px 0 rgb(0 0 0 / 0.05)',
                            border: '1px solid #e5e7eb'
                        }}>
                            {/* Video Section */}
                            {item.videoUrl && (
                                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                                    <iframe
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        src={`https://www.youtube.com/embed/${item.videoUrl}`}
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                                    {item.videoUrl && (
                                        <span style={{ display: 'flex', alignItems: 'center', color: '#ef4444', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem' }}>
                                            <PlayCircle size={12} style={{ marginRight: '4px' }} /> 動画あり
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>{item.title}</h3>

                                <div style={{ lineHeight: '1.8', color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
