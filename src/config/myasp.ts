/**
 * MYASP決済システム設定
 * 
 * 実際の決済URL: https://my75p.com/p/r/GXYF9HvG
 */

export const MYASP_CONFIG = {
    paymentUrl: "https://my75p.com/p/r/GXYF9HvG", // 実際のMYASP決済URL

    // デフォルトのコースID（この決済で登録するコース）
    defaultCourseId: '8133eb01-f6f6-45f8-8810-1a57beec5fb8',

    // デフォルトの最初のレッスンID（自動ログイン後に表示）
    defaultLessonId: 'e2c10343-0413-4c93-b05c-592b225c00dd',

    // ワンタイムトークンの有効期限（ミリ秒）
    tokenExpirationMs: 10 * 60 * 1000, // 10分
};

/**
 * サンクスページURL（MYASP管理画面に設定）
 * https://yourdomain.com/payment/myasp/success?email={email}&name={name}&transaction_id={transaction_id}
 */
