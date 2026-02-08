import { db } from "@/lib/db";
import { users, enrollments, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import styles from "../../courses/AdminCourses.module.css";
import { ArrowLeft, Mail, Calendar } from "lucide-react";
import EnrollmentManager from "@/components/admin/EnrollmentManager";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!user) {
        return <div>User not found</div>;
    }

    // Fetch all courses
    const allCourses = await db.select({ id: courses.id, title: courses.title }).from(courses);

    // Fetch user enrollments
    const userEnrollments = await db.select({ courseId: enrollments.courseId })
        .from(enrollments)
        .where(eq(enrollments.userId, id));

    const enrolledCourseIds = userEnrollments.map(e => e.courseId);

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

            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                    講座登録管理
                </h2>
                <EnrollmentManager
                    userId={id}
                    courses={allCourses}
                    enrolledCourseIds={enrolledCourseIds}
                />
            </div>
        </div>
    );
}
