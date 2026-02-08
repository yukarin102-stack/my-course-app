"use client";

import { useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

/**
 * MYASP Auto-Login Page
 * This page handles the actual login and redirect
 */
function LoginContent() {
    const searchParams = useSearchParams();
    const userId = searchParams?.get('user_id');
    const redirect = searchParams?.get('redirect') || '/dashboard';

    useEffect(() => {
        if (userId) {
            // In a real implementation, you would need to create a special
            // NextAuth provider or session creation method for trusted auto-login
            // For now, we'll redirect to login with a message
            window.location.href = `/login?message=payment_complete&redirect=${encodeURIComponent(redirect)}`;
        }
    }, [userId, redirect]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f9fafb'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000' }}>
                    決済が完了しました！
                </h1>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    アカウントにログインしています...
                </p>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto'
                }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default function MYASPLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
