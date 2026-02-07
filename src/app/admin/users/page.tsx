import { db } from "@/lib/db";
import { users, enrollments } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";
import Link from "next/link";
import styles from "../courses/AdminCourses.module.css"; // Reuse styles
import { User } from "lucide-react";

export default async function AdminUsersPage() {
    const userList = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
    })
        .from(users)
        .orderBy(desc(users.createdAt));

    return (
        <div>
            <h1 className={styles.pageTitle}>受講者管理</h1>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>名前</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>メールアドレス</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>権限</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>登録日</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', color: '#6b7280' }}>詳細</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={16} color="#6b7280" />
                                    </div>
                                    {user.name || "Unknown"}
                                </td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: user.role === 'admin' ? '#fee2e2' : '#d1fae5',
                                        color: user.role === 'admin' ? '#dc2626' : '#059669'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    {user.createdAt?.toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <Link href={`/admin/users/${user.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                                        詳細を見る
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {userList.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>ユーザーが見つかりません</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
