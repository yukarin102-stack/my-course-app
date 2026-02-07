"use client";

import { useState } from "react";
import CreatePostForm from "@/components/community/CreatePostForm";
import { PlusCircle } from "lucide-react";

// Using inline styles matching Community.module.css concepts or hardcoded
// Ideally reuse styles but importing CSS module in client component from parent page dir is tricky.

export default function CreatePostWrapper({ courseId }: { courseId: string }) {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return <CreatePostForm courseId={courseId} onClose={() => setIsOpen(false)} />;
    }

    return (
        <button
            onClick={() => setIsOpen(true)}
            style={{
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            <PlusCircle size={18} />
            投稿を作成
        </button>
    );
}
