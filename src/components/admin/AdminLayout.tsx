"use client";

import Link from "next/link";
import styles from "./AdminLayout.module.css";
import {
    LayoutDashboard, BookOpen, Users, Bell, Tag, ArrowLeft, FileText,
    User, LogOut, Settings, ExternalLink
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <Link href="/">Admin Console</Link>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navItem}>
                        <LayoutDashboard size={20} /> ダッシュボード
                    </Link>
                    <Link href="/admin/courses" className={styles.navItem}>
                        <BookOpen size={20} /> 講座管理
                    </Link>
                    <Link href="/admin/users" className={styles.navItem}>
                        <Users size={20} /> 受講者管理
                    </Link>
                    <Link href="/admin/announcements" className={styles.navItem}>
                        <Bell size={20} /> お知らせ管理
                    </Link>
                    <Link href="/admin/coupons" className={styles.navItem}>
                        <Tag size={20} /> クーポン管理
                    </Link>
                    <Link href="/admin/media" className={styles.navItem}>
                        <FileText size={20} /> データアップロード
                    </Link>
                    <Link href="/dashboard" className={styles.navItem} style={{ marginTop: 'auto', color: '#9ca3af' }}>
                        <ArrowLeft size={20} /> マイページに戻る
                    </Link>
                </nav>
            </aside>
            <main className={styles.main}>
                <header className={styles.topHeader}>
                    <div className={styles.headerRight}>
                        <Link href="/" className={styles.viewSiteButton} target="_blank">
                            <ExternalLink size={16} />
                            サイトを表示
                        </Link>

                        {session && (
                            <div className={styles.userMenu} ref={dropdownRef}>
                                <button
                                    className={styles.userButton}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <User size={24} />
                                </button>

                                {dropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <div className={styles.dropdownInfo}>
                                            {session.user?.name || "ユーザー"}
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className={styles.dropdownItem}
                                        >
                                            <User size={16} />
                                            マイページ
                                        </Link>
                                        <Link
                                            href="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className={styles.dropdownItem}
                                        >
                                            <Settings size={16} />
                                            管理画面
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                            className={styles.dropdownItem}
                                        >
                                            <LogOut size={16} />
                                            ログアウト
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
