import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { oneTimeTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { signIn } from "next-auth/react";

/**
 * MYASP Callback Endpoint
 * GET /auth/myasp/callback
 * 
 * Handles auto-login after successful MYASP payment
 * URL params: token, course_id, lesson_id (optional)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const courseId = searchParams.get('course_id');
    const lessonId = searchParams.get('lesson_id');

    if (!token || !courseId) {
        return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }

    try {
        // Find token in database
        const tokenRecord = await db.select()
            .from(oneTimeTokens)
            .where(eq(oneTimeTokens.token, token))
            .get();

        if (!tokenRecord) {
            console.error('[MYASP Callback] Token not found:', token);
            return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
        }

        // Check if token is already used
        if (tokenRecord.used) {
            console.error('[MYASP Callback] Token already used:', token);
            return NextResponse.redirect(new URL('/login?error=token_used', request.url));
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(tokenRecord.expiresAt);
        if (now > expiresAt) {
            console.error('[MYASP Callback] Token expired:', token);
            return NextResponse.redirect(new URL('/login?error=token_expired', request.url));
        }

        // Mark token as used
        await db.update(oneTimeTokens)
            .set({ used: true })
            .where(eq(oneTimeTokens.id, tokenRecord.id));

        console.log('[MYASP Callback] Token validated for user:', tokenRecord.userId);

        // Build redirect URL to course page
        let redirectUrl = `/courses/${courseId}/learn`;
        if (lessonId) {
            redirectUrl += `?lessonId=${lessonId}`;
        }

        // In Next.js, we need to redirect to a page that will handle the actual login
        // Create a special login handler page
        const loginRedirectUrl = new URL('/auth/myasp/login', request.url);
        loginRedirectUrl.searchParams.set('user_id', tokenRecord.userId);
        loginRedirectUrl.searchParams.set('redirect', redirectUrl);

        return NextResponse.redirect(loginRedirectUrl);

    } catch (error) {
        console.error('[MYASP Callback] Error:', error);
        return NextResponse.redirect(new URL('/login?error=server_error', request.url));
    }
}
