import { test, expect } from '@playwright/test';

test('Assignment Feature Flow (Manual Target)', async ({ page }) => {
    test.setTimeout(60000);

    const courseId = "8133eb01-f6f6-45f8-8810-1a57beec5fb8";
    const lessonId = "e2c10343-0413-4c93-b05c-592b225c00dd"; // Test Assignment Manual

    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', '0000@example.com');
    await page.fill('input[name="password"]', '2136');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Student: Submit Assignment
    await page.goto(`/courses/${courseId}/learn?lessonId=${lessonId}`);

    await expect(page.locator('text=📑 課題:')).toBeVisible();

    // Submit
    await page.fill('textarea[name="content"]', 'My goal is to learn Next.js and pass the review.');
    await page.click('button:has-text("提出")'); // Matches "提出する" or "更新して再提出"

    // Verify Submitted state
    await page.waitForSelector('text=提出が完了しました', { timeout: 10000 });
    await page.reload();
    await page.waitForSelector('text=提出済み');
    // Use .first() to avoid ambiguity between display and form
    await expect(page.locator('text=My goal is to learn Next.js').first()).toBeVisible();

    // 3. Admin: Grade Assignment
    await page.goto(`/admin/courses/${courseId}/assignments/${lessonId}`);

    // Grading Page
    await expect(page.locator('text=課題提出一覧')).toBeVisible();
    await expect(page.locator('text=My goal is to learn Next.js').first()).toBeVisible();

    // Submit Grade
    await page.fill('input[name="grade"]', '100');
    await page.fill('textarea[name="feedback"]', 'Excellent work!');
    await page.click('button:has-text("保存する")');

    await page.waitForSelector('text=保存しました');

    // 4. Student: Check Feedback
    await page.goto(`/courses/${courseId}/learn?lessonId=${lessonId}`);

    await expect(page.locator('text=添削済み')).toBeVisible();
    await expect(page.locator('text=100')).toBeVisible();
    await expect(page.locator('text=Excellent work!')).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'artifacts/assignment_flow.png', fullPage: true });
});
