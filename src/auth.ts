import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "./lib/db";
import { users, oneTimeTokens } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function getUser(email: string) {
    try {
        const user = await db.select().from(users).where(eq(users.email, email)).get();
        return user;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);

                // Token-based login
                if (credentials?.email === "token-login") {
                    const token = credentials.password as string;
                    console.log("Token login attempt");

                    if (!token) return null;

                    try {
                        const tokenRecord = await db.select()
                            .from(oneTimeTokens)
                            .where(eq(oneTimeTokens.token, token))
                            .get();

                        if (!tokenRecord) {
                            console.log("Token not found");
                            return null;
                        }

                        if (tokenRecord.used) {
                            console.log("Token already used");
                            // Allow reuse for debugging/retry if within short window? No, strict once.
                            return null;
                        }

                        if (new Date() > new Date(tokenRecord.expiresAt)) {
                            console.log("Token expired");
                            return null;
                        }

                        // Mark token as used
                        await db.update(oneTimeTokens)
                            .set({ used: true })
                            .where(eq(oneTimeTokens.id, tokenRecord.id));

                        // Fetch user
                        const user = await db.select().from(users).where(eq(users.id, tokenRecord.userId)).get();
                        console.log("Token login successful for user:", user?.email);
                        return user || null;
                    } catch (e) {
                        console.error("Token login error:", e);
                        return null;
                    }
                }

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(4) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    console.log("User found:", user ? user.email : "null");
                    if (!user) return null;

                    if (!user.password) {
                        console.log("No password set for user");
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log("Password match:", passwordsMatch);

                    if (passwordsMatch) return user;
                } else {
                    console.log("Zod parse failed", parsedCredentials.error);
                }

                console.log("Invalid credentials end of function");
                return null;
            },
        }),
    ],
    // Override jwt callback to include DB fetch for role sync if needed on session update
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            // Standard behavior from config
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
                return token;
            }

            // If we want to refresh role from DB on every verify (optional but good for admin revoke)
            if (token.sub) {
                try {
                    const existingUser = await db.query.users.findFirst({
                        where: eq(users.id, token.sub),
                    });
                    if (existingUser) {
                        token.role = existingUser.role;
                    }
                } catch (e) {
                    // Ignore DB errors in token refresh to avoid hard crash if DB is flaky? 
                    // Or log it.
                    console.error("Token refresh failed", e);
                }
            }
            return token;
        }
    }
});
