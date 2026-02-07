import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { myaspTransactions, users, enrollments, oneTimeTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

// MYASP Webhook payload type
type MYASPWebhookPayload = {
    event: string;
    transaction_id: string;
    customer_email: string;
    customer_name?: string;
    product_id?: string;
    amount?: number;
    custom_fields?: {
        course_id?: string;
        lesson_id?: string;
    };
};

/**
 * MYASP Webhook Endpoint
 * POST /api/webhooks/myasp
 * 
 * Receives payment completion notifications from MYASP and:
 * 1. Creates/updates user account
 * 2. Enrolls user in course
 * 3. Generates one-time login token
 */
export async function POST(request: NextRequest) {
    try {
        const payload: MYASPWebhookPayload = await request.json();

        // TODO: Verify webhook signature
        // const signature = request.headers.get('x-myasp-signature');
        // if (!verifySignature(payload, signature)) {
        //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        // }

        console.log('[MYASP Webhook] Received:', payload);

        // Check if transaction already processed
        const existingTransaction = await db.select()
            .from(myaspTransactions)
            .where(eq(myaspTransactions.transactionId, payload.transaction_id))
            .get();

        if (existingTransaction) {
            console.log('[MYASP Webhook] Transaction already processed:', payload.transaction_id);
            return NextResponse.json({ message: 'Already processed' }, { status: 200 });
        }

        // Extract course and lesson IDs
        const courseId = payload.custom_fields?.course_id;
        const lessonId = payload.custom_fields?.lesson_id;

        if (!courseId) {
            console.error('[MYASP Webhook] Missing course_id');
            return NextResponse.json({ error: 'Missing course_id' }, { status: 400 });
        }

        // Find or create user
        let user = await db.select()
            .from(users)
            .where(eq(users.email, payload.customer_email))
            .get();

        if (!user) {
            // Create new user with random password
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const [newUser] = await db.insert(users).values({
                email: payload.customer_email,
                name: payload.customer_name || payload.customer_email.split('@')[0],
                password: hashedPassword,
                role: 'user',
            }).returning();

            user = newUser;
            console.log('[MYASP Webhook] Created new user:', user.id);

            // TODO: Send welcome email with login credentials
        } else {
            console.log('[MYASP Webhook] Found existing user:', user.id);
        }

        // Enroll user in course
        const existingEnrollment = await db.select()
            .from(enrollments)
            .where(and(
                eq(enrollments.userId, user.id),
                eq(enrollments.courseId, courseId)
            ))
            .get();

        if (!existingEnrollment) {
            await db.insert(enrollments).values({
                userId: user.id,
                courseId: courseId,
            });
            console.log('[MYASP Webhook] Enrolled user in course:', courseId);
        } else {
            console.log('[MYASP Webhook] User already enrolled in course');
        }

        // Record transaction
        await db.insert(myaspTransactions).values({
            transactionId: payload.transaction_id,
            customerEmail: payload.customer_email,
            productId: payload.product_id,
            amount: payload.amount,
            courseId: courseId,
            userId: user.id,
        });

        // Generate one-time login token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.insert(oneTimeTokens).values({
            token: token,
            userId: user.id,
            expiresAt: expiresAt,
            used: false,
        });

        console.log('[MYASP Webhook] Generated one-time token for user:', user.id);

        // Build redirect URL for MYASP
        const redirectUrl = new URL('/auth/myasp/callback', process.env.NEXTAUTH_URL || 'http://localhost:3005');
        redirectUrl.searchParams.set('token', token);
        redirectUrl.searchParams.set('course_id', courseId);
        if (lessonId) {
            redirectUrl.searchParams.set('lesson_id', lessonId);
        }

        console.log('[MYASP Webhook] Redirect URL:', redirectUrl.toString());

        return NextResponse.json({
            success: true,
            redirect_url: redirectUrl.toString(),
        }, { status: 200 });

    } catch (error) {
        console.error('[MYASP Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
