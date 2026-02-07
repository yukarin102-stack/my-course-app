import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPage = nextUrl.pathname.startsWith("/admin");

            if (isAdminPage) {
                if (isLoggedIn && (auth.user as any).role === 'admin') return true;
                return false; // Redirect to login
            }

            // Allow all other pages mainly, or protect specific dashboard routes if needed
            // For now, only admin is strictly protected by middleware.
            // Dashboard protection is often better done per-page for granularity, 
            // or we can add it here:
            if (nextUrl.pathname.startsWith("/dashboard")) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as "user" | "admin";
            }
            return session;
        },
        async jwt({ token, user }) {
            // Initial sign in or subsequent
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
            }
            return token;
        }
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
