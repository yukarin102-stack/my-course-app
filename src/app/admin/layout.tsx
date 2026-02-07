import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    // Allow all logged-in users in development
    if (!session?.user) {
        redirect("/login");
    }

    return <AdminLayout>{children}</AdminLayout>;
}
