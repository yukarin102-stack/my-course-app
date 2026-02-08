import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { myaspTransactions, users, enrollments, oneTimeTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { MYASP_CONFIG } from "@/config/myasp";

/**
 * MYASP決済完了後のサンクスページ
 * 
 * MYASPの管理画面でこのURLを設定:
 * https://yourdomain.com/payment/myasp/success?email={email}&name={name}&transaction_id={transaction_id}
 */
export default async function MYASPSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        email?: string;
        name?: string;
        transaction_id?: string;
        amount?: string;
        course_id?: string;
        lesson_id?: string;
    }>;
}) {
    const params = await searchParams;

    // 必須パラメータチェック
    if (!params.email) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    エラー: メールアドレスが見つかりません
                </h1>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    決済情報が不完全です。お手数ですが、サポートまでお問い合わせください。
                </p>
                <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                    トップページに戻る
                </a>
            </div>
        );
    }

    const email = params.email;
    const name = params.name || email.split('@')[0];
    const transactionId = params.transaction_id || `MANUAL_${Date.now()}_${email}`;
    const amount = params.amount ? parseInt(params.amount) : 0;

    // コース・レッスンID（パラメータから取得、なければデフォルト値を使用）
    const courseId = params.course_id || MYASP_CONFIG.defaultCourseId;
    const lessonId = params.lesson_id || MYASP_CONFIG.defaultLessonId;

    try {
        // 1. 重複チェック
        const existingTransaction = await db.select()
            .from(myaspTransactions)
            .where(eq(myaspTransactions.transactionId, transactionId))
            .get();

        let userId: string;

        if (existingTransaction) {
            // 既に処理済みの場合は、既存のユーザーIDを使用
            console.log('[MYASP Success] Transaction already processed:', transactionId);
            userId = existingTransaction.userId!;
        } else {
            // 2. ユーザー作成/取得
            let user = await db.select()
                .from(users)
                .where(eq(users.email, email))
                .get();

            if (!user) {
                // 新規ユーザー作成
                const randomPassword = crypto.randomBytes(16).toString('hex');
                const bcrypt = await import('bcryptjs');
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                const [newUser] = await db.insert(users).values({
                    email: email,
                    name: name,
                    password: hashedPassword,
                    role: 'user',
                }).returning();

                user = newUser;
                console.log('[MYASP Success] Created new user:', user.id);
            } else {
                console.log('[MYASP Success] Found existing user:', user.id);
            }

            userId = user.id;

            // 3. コース登録
            const existingEnrollment = await db.select()
                .from(enrollments)
                .where(and(
                    eq(enrollments.userId, userId),
                    eq(enrollments.courseId, courseId)
                ))
                .get();

            if (!existingEnrollment) {
                await db.insert(enrollments).values({
                    userId: userId,
                    courseId: courseId,
                });
                console.log('[MYASP Success] Enrolled user in course:', courseId);
            } else {
                console.log('[MYASP Success] User already enrolled');
            }

            // 4. トランザクション記録
            await db.insert(myaspTransactions).values({
                transactionId: transactionId,
                customerEmail: email,
                amount: amount,
                courseId: courseId,
                userId: userId,
            });

            console.log('[MYASP Success] Recorded transaction:', transactionId);
        }

        // 5. ワンタイムトークン生成
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + MYASP_CONFIG.tokenExpirationMs);

        await db.insert(oneTimeTokens).values({
            token: token,
            userId: userId,
            expiresAt: expiresAt,
            used: false,
        });

        console.log('[MYASP Success] Generated token for user:', userId);

        // 6. ダッシュボードへリダイレクト（自動ログイン経由）
        // トークンを持ってログインページに行き、そこから自動ログインしてDashboardへ
        const redirectUrl = `/login?message=payment_success&token=${token}&callbackUrl=/dashboard`;
        redirect(redirectUrl);

    } catch (error) {
        console.error('[MYASP Success] Error:', error);

        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    処理中にエラーが発生しました
                </h1>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                    決済は完了していますが、アカウント登録中にエラーが発生しました。
                    <br />
                    お手数ですが、サポートまでお問い合わせください。
                </p>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>
                    エラーID: {transactionId}
                </p>
            </div>
        );
    }
}
