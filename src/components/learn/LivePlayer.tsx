"use client";

import { Video, Calendar, Clock } from "lucide-react";

export default function LivePlayer({ videoUrl, title, description }: { videoUrl?: string | null, title: string, description?: string | null }) {
    // Simple check for YouTube URL to embed
    const isYoutube = videoUrl?.includes("youtube") || videoUrl?.includes("youtu.be");
    // Simple check for Zoom
    const isZoom = videoUrl?.includes("zoom");

    return (
        <div style={{ padding: '2rem', backgroundColor: '#111', color: 'white', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔴 ライブ配信</h2>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ccc' }}>{title}</h3>
            </div>

            {videoUrl ? (
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    {isYoutube ? (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}`}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#222' }}>
                            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>以下のリンクから配信に参加してください</p>
                            <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '1rem 2rem',
                                    backgroundColor: '#e11d48',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {isZoom ? "Zoomミーティングに参加" : "配信に参加する"}
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#888' }}>
                    <Calendar size={48} style={{ marginBottom: '1rem' }} />
                    <p>配信URLはまだ設定されていません。</p>
                </div>
            )}
        </div>
    );
}
