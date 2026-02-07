import { db } from "@/lib/db";
import { users, enrollments, courses } from "@/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";
import SalesChart from "@/components/admin/SalesChart";

export default async function AdminDashboardPage() {
    // Fetch some stats
    const [userCount] = await db.select({ count: count() }).from(users);
    const [courseCount] = await db.select({ count: count() }).from(courses);
    const [enrollmentCount] = await db.select({ count: count() }).from(enrollments);

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>ダッシュボード</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>総売上 (推定)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>¥{(enrollmentCount.count * 29800).toLocaleString()}</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>受講者数</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{userCount.count}</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>開講中コース</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{courseCount.count}</p>
                </div>
            </div>

            <SalesChart />
        </div>
    );
}
