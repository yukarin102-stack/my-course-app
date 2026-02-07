"use server";

import { db } from "@/lib/db";
import { enrollments, courses } from "@/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/auth";

export type SalesDataPoint = {
    date: string;
    amount: number;
};

export async function getSalesData(days: number = 30): Promise<SalesDataPoint[]> {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Determine date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Use raw SQL for date grouping in SQLite
    // strftime('%Y-%m-%d', purchased_at / 1000, 'unixepoch') depending on how timestamp is stored. Use 'auto' mapped timestamp.
    const result = await db.all(sql`
    SELECT 
      date(purchased_at / 1000, 'unixepoch', 'localtime') as sale_date,
      SUM(courses.price) as daily_total
    FROM ${enrollments}
    JOIN ${courses} ON ${enrollments.courseId} = ${courses.id}
    WHERE ${enrollments.purchasedAt} >= ${startDate.getTime()}
    GROUP BY sale_date
    ORDER BY sale_date ASC
  `);

    // Fill in missing dates with 0
    const dataMap = new Map<string, number>();
    result.forEach((row: any) => {
        dataMap.set(row.sale_date, row.daily_total);
    });

    const chartData: SalesDataPoint[] = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        chartData.push({
            date: dateStr,
            amount: dataMap.get(dateStr) || 0,
        });
    }

    return chartData;
}
