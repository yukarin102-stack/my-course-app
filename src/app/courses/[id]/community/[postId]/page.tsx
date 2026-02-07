import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts, comments, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import styles from "../Community.module.css";
import Link from "next/link";
import CommentForm from "@/components/community/CommentForm";
import { notFound } from "next/navigation";

export default async function PostDetailsPage({
    params
}: {
    params: Promise<{ id: string, postId: string }>
}) {
    const { id, postId } = await params;
    const session = await auth();

    // Fetch post details with user
    const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
        with: {
            user: true,
        }
    });

    if (!post) notFound();

    // Fetch comments manually to ensure ordering (Drizzle with relation order might be tricky, explicit query is safer for now)
    // Or use query builder with orderBy
    const postComments = await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        orderBy: [asc(comments.createdAt)], // Oldest first for thread usually? Or newest? Let's do oldest first like standard forums.
        with: {
            user: true
        }
    });

    return (
        <div className={styles.container}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/courses/${id}/community`} style={{ color: '#888', textDecoration: 'none' }}>
                    &larr; コミュニティ一覧に戻る
                </Link>
            </div>

            <article style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '2rem' }}>
                <h1 style={{ color: 'white', fontSize: '2rem', marginTop: 0, marginBottom: '1rem' }}>{post.title}</h1>
                <div style={{ display: 'flex', gap: '1rem', color: '#888', marginBottom: '2rem', fontSize: '0.9rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    <span>投稿者: {post.user.name}</span>
                    <span>{new Date(post.createdAt!).toLocaleString()}</span>
                </div>
                <div style={{ color: '#e1e1e1', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>
            </article>

            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>コメント ({postComments.length})</h2>

            <div className={styles.commentList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {postComments.map((comment) => (
                    <div key={comment.id} style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <span style={{ fontWeight: 'bold', color: '#ccc' }}>{comment.user.name}</span>
                            <span style={{ color: '#666', fontSize: '0.85rem' }}>{new Date(comment.createdAt!).toLocaleString()}</span>
                        </div>
                        <div style={{ color: '#ddd', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                    </div>
                ))}
            </div>

            <CommentForm postId={postId} courseId={id} />
        </div>
    );
}
