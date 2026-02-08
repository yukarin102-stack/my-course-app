"use client";

import { deleteCourse } from "@/actions/course";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("この講座を削除してもよろしいですか？\n関連するモジュール、レッスン、受講データも全て削除されます。")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteCourse(courseId);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
                color: isPending ? '#ccc' : '#ef4444',
                background: 'none',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
            }}
        >
            <Trash2 size={16} />
            {isPending ? "削除中..." : "削除"}
        </button>
    );
}
