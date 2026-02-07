import { db } from "@/lib/db";
import { users, enrollments, courses, progress, lessons } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import styles from "../../courses/AdminCourses.module.css";
import { ArrowLeft, Mail, Calendar, BookOpen } from "lucide-react";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!user) {
        return <div>User not found</div>;
    }

    // Fetch Enrollments with Course Titles
    const userEnrollments = await db.select({
        courseId: courses.id,
        courseTitle: courses.title,
        purchasedAt: enrollments.purchasedAt,
    })
        .from(enrollments)
        .innerJoin(courses, eq(enrollments.courseId, courses.id))
        .where(eq(enrollments.userId, id));

    // Calculate progress for each course is tricky without aggregation, doing simplistic per-course logic
    // Actually, let's just show raw items for now or simple "status"

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', color: '#6b7280', textDecoration: 'none', marginBottom: '1rem' }}>
                    <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> ユーザー一覧に戻る
                </Link>
                <h1 className={styles.pageTitle} style={{ marginBottom: '0.5rem' }}>{user.name || "名称未設定"}</h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {user.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> 登録日: {user.createdAt?.toLocaleDateString()}</span>
                </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                受講状況
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {userEnrollments.map(enrol => (
                    <div key={enrol.courseId} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <BookOpen size={18} color="#2563eb" />
                            {enrol.courseTitle}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            受講開始日: {enrol.purchasedAt?.toLocaleDateString()}
                        </p>
                        {/* Future: Add progress bar here by querying `progress` table */}
                    </div>
                ))}
                {userEnrollments.length === 0 && (
                    <p style={{ color: '#6b7280' }}>受講中のコースはありません。</p>
                )}
            </div>
        </div>
    );
}
