"use client";

import { useState, useEffect } from "react";
import { uploadFile, listFiles } from "@/actions/upload";
import styles from "./Media.module.css"; // We'll assume inline styles or create simple module
import { Upload, File, Copy, Check, RefreshCw } from "lucide-react";

export default function MediaPage() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const loadFiles = async () => {
        const fileList = await listFiles();
        setFiles(fileList);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await uploadFile(formData);

        if (result.error) {
            setMessage({ text: result.error, type: 'error' });
        } else if (result.success) {
            setMessage({ text: "アップロード完了！", type: 'success' });
            (e.target as HTMLFormElement).reset();
            loadFiles(); // Reload list
        }
        setUploading(false);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>メディア管理（データアップロード）</h1>

            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={20} /> 新規アップロード
                </h2>
                <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="file"
                        name="file"
                        required
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: uploading ? '#ccc' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {uploading ? 'アップロード中...' : 'アップロード'}
                    </button>
                </form>
                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#dc2626' : '#166534'
                    }}>
                        {message.text}
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>アップロード済みファイル一覧</h2>
                    <button onClick={loadFiles} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        <RefreshCw size={16} /> 更新
                    </button>
                </div>

                {files.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>ファイルはまだありません</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {files.map((file) => (
                            <div key={file.name} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                border: '1px solid #eee',
                                borderRadius: '4px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                                    <div style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                                        <File size={24} color="#666" />
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <p style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {file.name}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {(file.size / 1024 / 1024).toFixed(2)} MB - {new Date(file.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f9fafb', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                                        <input
                                            readOnly
                                            value={file.url}
                                            style={{ border: 'none', background: 'transparent', width: '200px', fontSize: '0.9rem', color: '#444' }}
                                        />
                                        <button
                                            onClick={() => copyToClipboard(file.url, file.name)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === file.name ? '#166534' : '#666' }}
                                            title="URLをコピー"
                                        >
                                            {copiedId === file.name ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem' }}
                                    >
                                        表示
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
