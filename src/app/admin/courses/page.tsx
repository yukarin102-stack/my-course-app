import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCoursesPage() {
    const allCourses = await db.select().from(courses);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>講座管理</h1>
                <Link href="/admin/courses/new">
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        <Plus size={20} /> 新規講座作成
                    </button>
                </Link>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>講座名</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>価格</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>ステータス</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>アクション</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCourses.map((course) => (
                            <tr key={course.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{course.title}</td>
                                <td style={{ padding: '1rem' }}>¥{course.price.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.8rem',
                                        backgroundColor: course.published ? '#dcfce7' : '#f3f4f6',
                                        color: course.published ? '#166534' : '#6b7280'
                                    }}>
                                        {course.published ? '公開中' : '下書き'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <Link href={`/admin/courses/${course.id}`} style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginRight: '1rem' }}>
                                        編集
                                    </Link>
                                    <Link href={`/courses/${course.id}`} target="_blank" style={{ color: '#666' }}>
                                        プレビュー
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allCourses.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                        講座がまだありません。新規作成ボタンから作成してください。
                    </div>
                )}
            </div>
        </div>
    );
}
