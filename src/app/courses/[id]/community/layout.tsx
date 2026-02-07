import { auth } from "@/auth";
import { getCourseWithProgress } from "@/lib/course-data";
import { redirect, notFound } from "next/navigation";
import CourseSidebar from "@/components/course/CourseSidebar";
import styles from "../learn/Learn.module.css"; // Reuse learn styles for container

export default async function CommunityLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/courses/${id}/community`);
    }

    const data = await getCourseWithProgress(id, session.user.id);
    if (!data) notFound();

    return (
        <div className={styles.container}>
            <CourseSidebar
                courseId={id}
                courseTitle={data.course.title}
                modules={data.modules}
            />

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
