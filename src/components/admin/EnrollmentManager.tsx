"use client";

import { adminEnrollUser, adminUnenrollUser } from "@/actions/enroll";
import { useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";

type Course = {
    id: string;
    title: string;
};

type Props = {
    userId: string;
    courses: Course[];
    enrolledCourseIds: string[];
};

export default function EnrollmentManager({ userId, courses, enrolledCourseIds }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleEnroll = (courseId: string) => {
        startTransition(async () => {
            const result = await adminEnrollUser(userId, courseId);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    const handleUnenroll = (courseId: string) => {
        if (!confirm("この講座の登録を解除してもよろしいですか？")) return;

        startTransition(async () => {
            const result = await adminUnenrollUser(userId, courseId);
            if (result.error) {
                alert(result.error);
            }
        });
    };

    const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
    const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));

    return (
        <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>受講中の講座</h3>

            {enrolledCourses.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>受講中の講座はありません</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {enrolledCourses.map(course => (
                        <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                            <span style={{ fontWeight: 'bold' }}>{course.title}</span>
                            <button
                                onClick={() => handleUnenroll(course.id)}
                                disabled={isPending}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer' }}
                            >
                                <Trash2 size={14} /> 登録解除
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {availableCourses.length > 0 && (
                <>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '2rem' }}>講座を追加</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {availableCourses.map(course => (
                            <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                <span>{course.title}</span>
                                <button
                                    onClick={() => handleEnroll(course.id)}
                                    disabled={isPending}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', padding: '0.25rem 0.5rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer' }}
                                >
                                    <Plus size={14} /> {isPending ? '処理中...' : '登録する'}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
