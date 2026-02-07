import { db } from "@/lib/db";
import { courses, modules, lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import styles from "../AdminCourses.module.css";
import Link from "next/link";
import { updateCourse } from "@/actions/course";
import { createModule } from "@/actions/module";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import AddModuleForm from "@/components/admin/AddModuleForm";
import CourseEditForm from "@/components/admin/CourseEditForm";
import ModuleItem from "@/components/admin/ModuleItem";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import AdminPostForm from "@/components/admin/AdminPostForm";
import { announcements, posts, comments } from "@/db/schema";
import { desc } from "drizzle-orm";

async function ModuleList({ courseId }: { courseId: string }) {
    // Fetch modules and their lessons
    const courseModules = await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order));
    const modulesWithLessons = await Promise.all(courseModules.map(async (mod) => {
        const modLessons = await db.select().from(lessons).where(eq(lessons.moduleId, mod.id)).orderBy(asc(lessons.order));
        return { ...mod, lessons: modLessons };
    }));

    return (
        <div className={styles.moduleList}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>カリキュラム (章の管理)</h3>

            {modulesWithLessons.map((mod) => (
                <ModuleItem key={mod.id} module={mod} />
            ))}

            <AddModuleForm courseId={courseId} />
        </div>
    );
}

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!course) notFound();

    return (
        <div className={styles.formContainer}>
            <CourseEditForm course={course} />

            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>コースお知らせ管理</h3>
                <AnnouncementList courseId={course.id} />
            </div>

            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>コミュニティ投稿管理</h3>
                <CommunityPostList courseId={course.id} />
            </div>

            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

            <ModuleList courseId={course.id} />
        </div>
    );
}

async function CommunityPostList({ courseId }: { courseId: string }) {
    const postsList = await db.query.posts.findMany({
        where: eq(posts.courseId, courseId),
        orderBy: [desc(posts.createdAt)],
        with: {
            user: true,
            comments: true,
        }
    });

    return (
        <div>
            <AdminPostForm courseId={courseId} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {postsList.length === 0 ? (
                    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'center', color: '#6b7280' }}>
                        まだ投稿はありません。
                    </div>
                ) : (
                    postsList.map(post => (
                        <div key={post.id} style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-wrap', marginBottom: '0.5rem' }}>
                                {post.content}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                投稿者: {post.user.name} • コメント {post.comments?.length || 0}件
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

async function AnnouncementList({ courseId }: { courseId: string }) {
    const list = await db.query.announcements.findMany({
        where: eq(announcements.courseId, courseId),
        orderBy: [desc(announcements.createdAt)],
    });

    return (
        <div>
            <AnnouncementForm courseId={courseId} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                {list.map(item => (
                    <div key={item.id} style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                            </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#334155', whiteSpace: 'pre-wrap' }}>
                            {item.content}
                        </div>
                        {item.videoUrl && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#2563eb' }}>
                                📺 動画あり: {item.videoUrl}
                            </div>
                        )}
                        {/* Delete logic could be added here */}
                    </div>
                ))}
            </div>
        </div>
    );
}
