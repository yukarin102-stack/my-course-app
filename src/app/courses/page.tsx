import { db } from "@/lib/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import styles from "./Courses.module.css";

export default async function CoursesPage() {
    const allCourses = await db.select().from(courses).where(eq(courses.published, true));

    return (
        <>
            <Header />
            <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '4rem 2rem',
                minHeight: 'calc(100vh - 200px)'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: '#000'
                }}>
                    講座一覧
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    marginBottom: '3rem'
                }}>
                    あなたに最適な講座を見つけましょう
                </p>

                {allCourses.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px'
                    }}>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>
                            現在公開中の講座はありません
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {allCourses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                    className="course-card"
                                >
                                    {course.thumbnailUrl && (
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            style={{
                                                width: '100%',
                                                height: '180px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                            marginBottom: '0.75rem',
                                            color: '#000'
                                        }}>
                                            {course.title}
                                        </h3>
                                        {course.description && (
                                            <p style={{
                                                color: '#666',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.6',
                                                marginBottom: '1rem',
                                                flex: 1
                                            }}>
                                                {course.description.length > 100
                                                    ? course.description.substring(0, 100) + '...'
                                                    : course.description}
                                            </p>
                                        )}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: 'auto'
                                        }}>
                                            <span style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                color: '#2563eb'
                                            }}>
                                                ¥{course.price.toLocaleString()}
                                            </span>
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#2563eb',
                                                color: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold'
                                            }}>
                                                詳細を見る
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
