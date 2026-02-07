"use client";

import { useEffect, useState } from "react";
import { SalesDataPoint, getSalesData } from "@/actions/analytics";
import styles from "./SalesChart.module.css";

export default function SalesChart() {
    const [data, setData] = useState<SalesDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSalesData().then(fetchedData => {
            setData(fetchedData);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div className={styles.loading}>Loading sales data...</div>;
    if (data.length === 0) return <div className={styles.empty}>No sales data available.</div>;

    const maxAmount = Math.max(...data.map(d => d.amount), 1); // Avoid division by zero

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>過去30日間の売上推移</h3>
            <div className={styles.chartBody}>
                {data.map((point) => (
                    <div key={point.date} className={styles.barGroup}>
                        <div
                            className={styles.bar}
                            style={{ height: `${(point.amount / maxAmount) * 100}%` }}
                            title={`${point.date}: ¥${point.amount.toLocaleString()}`}
                        ></div>
                        <span className={styles.label}>{formatDate(point.date)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
