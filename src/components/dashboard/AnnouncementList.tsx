import { db } from "@/lib/db";
import { announcements } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import styles from "./AnnouncementList.module.css";
import { Bell } from "lucide-react";

export default async function AnnouncementList() {
    const list = await db.select().from(announcements).where(eq(announcements.published, true)).orderBy(desc(announcements.createdAt)).limit(5);

    if (list.length === 0) return null;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}><Bell size={18} /> お知らせ</h3>
            <div className={styles.list}>
                {list.map(item => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.header}>
                            <span className={styles.date}>{item.createdAt?.toLocaleDateString()}</span>
                            {/* New Badge logic could go here if within X days */}
                        </div>
                        <div className={styles.content}>
                            <h4 className={styles.itemTitle}>{item.title}</h4>
                            <p className={styles.itemBody}>{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
