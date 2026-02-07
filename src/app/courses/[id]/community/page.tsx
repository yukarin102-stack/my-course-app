import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts, users, comments } from "@/db/schema"; // Import relations manually if needed or query builder
import { eq, desc, sql } from "drizzle-orm";
import styles from "./Community.module.css";
import Link from "next/link";
import CreatePostWrapper from "./CreatePostWrapper";
// I need a wrapper to toggle the CreatePostForm since page is server component.
// I'll create `CreatePostWrapper` in the same directory or components.

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    // Fetch posts
    // I want author name and comment count
    // Drizzle query builder:
    const coursePosts = await db.query.posts.findMany({
        where: eq(posts.courseId, id),
        orderBy: [desc(posts.createdAt)],
        with: {
            user: true,
            comments: true,
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>コミュニティ (掲示板)</h1>
                <CreatePostWrapper courseId={id} />
            </div>

            <div className={styles.postList}>
                {coursePosts.length === 0 ? (
                    <div style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                        まだ投稿がありません。最初のトピックを作成しましょう！
                    </div>
                ) : (
                    coursePosts.map((post) => (
                        <Link key={post.id} href={`/courses/${id}/community/${post.id}`} className={styles.postItem}>
                            <h3 className={styles.postTitle}>{post.title}</h3>
                            <div className={styles.postMeta}>
                                <span>作成者: {post.user.name}</span>
                                <span>•</span>
                                <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>コメント {post.comments.length}件</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
