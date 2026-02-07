import { db } from "@/lib/db";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import styles from "../courses/AdminCourses.module.css";
// reusing course styles for consistency
import { createAnnouncement, deleteAnnouncement } from "@/actions/marketing";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

async function DeleteButton({ id }: { id: string }) {
    "use server";
    return (
        <form action={deleteAnnouncement.bind(null, id)}>
            <button type="submit" style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}>削除</button>
        </form>
    );
}

export default async function AnnouncementsPage() {
    const list = await db.select().from(announcements).orderBy(desc(announcements.createdAt));

    return (
        <div>
            <h1 className={styles.pageTitle}>お知らせ管理</h1>

            <AnnouncementForm />

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>登録済みのお知らせ</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {list.map(item => (
                        <div key={item.id} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {item.title}
                                        {!item.published && <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem', border: '1px solid #ccc', padding: '0 4px', borderRadius: '4px' }}>下書き</span>}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{item.content}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                                        {item.createdAt?.toLocaleDateString()}
                                    </div>
                                </div>
                                <DeleteButton id={item.id} />
                            </div>
                        </div>
                    ))}
                    {list.length === 0 && <p style={{ color: '#666' }}>まだお知らせはありません。</p>}
                </div>
            </div>
        </div>
    );
}
