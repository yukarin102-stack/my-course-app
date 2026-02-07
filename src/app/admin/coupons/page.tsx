import { db } from "@/lib/db";
import { coupons } from "@/db/schema";
import { desc } from "drizzle-orm";
import styles from "../courses/AdminCourses.module.css";
import { createCoupon, deleteCoupon } from "@/actions/marketing";
import CouponForm from "@/components/admin/CouponForm";

async function DeleteButton({ id }: { id: string }) {
    "use server";
    return (
        <form action={deleteCoupon.bind(null, id)}>
            <button type="submit" style={{ color: "red", border: "none", background: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}>削除</button>
        </form>
    );
}

export default async function CouponsPage() {
    const list = await db.select().from(coupons).orderBy(desc(coupons.createdAt));

    return (
        <div>
            <h1 className={styles.pageTitle}>クーポン管理</h1>

            <CouponForm />

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>発行済みクーポン</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>コード</th>
                                <th style={{ padding: '0.75rem' }}>割引額</th>
                                <th style={{ padding: '0.75rem' }}>使用状況</th>
                                <th style={{ padding: '0.75rem' }}>期限</th>
                                <th style={{ padding: '0.75rem' }}>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(item => (
                                <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{item.code}</td>
                                    <td style={{ padding: '0.75rem' }}>¥{item.discountAmount.toLocaleString()}</td>
                                    <td style={{ padding: '0.75rem' }}>{item.usedCount} / {item.maxUses || '∞'}</td>
                                    <td style={{ padding: '0.75rem' }}>{item.expiresAt ? item.expiresAt.toLocaleDateString() : '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <DeleteButton id={item.id} />
                                    </td>
                                </tr>
                            ))}
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>クーポンはありません</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
