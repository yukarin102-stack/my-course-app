"use client";

import Link from "next/link";
import { Youtube, User, LogOut, Settings } from "lucide-react";
import styles from "./Header.module.css";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { MYASP_CONFIG } from "@/config/myasp";

export function Header() {
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
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Youtube color="red" />
                    <span>Youtube Hacks</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="#features" className={styles.navLink}>
                        特徴
                    </Link>
                    <Link href="#curriculum" className={styles.navLink}>
                        文章で読む
                    </Link>
                    <Link href="#pricing" className={styles.navLink}>
                        料金
                    </Link>
                    <Link href="#faq" className={styles.navLink}>
                        FAQ
                    </Link>
                </nav>

                <div className={styles.authButtons}>
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
                                    {((session.user as any).role === 'admin') && (
                                        <Link
                                            href="/admin/courses"
                                            onClick={() => setDropdownOpen(false)}
                                            className={styles.dropdownItem}
                                        >
                                            <Settings size={16} />
                                            管理画面
                                        </Link>
                                    )}
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

                    <a
                        href={MYASP_CONFIG.paymentUrl}
                        className={styles.ctaButton}
                    >
                        今すぐ講座に参加する
                    </a>
                </div>
            </div>
        </header>
    );
}
