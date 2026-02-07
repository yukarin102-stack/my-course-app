import { test, expect } from '@playwright/test';

test('Community Feature Flow', async ({ page }) => {
    // 1. Login as Admin/Existing User who has courses
    await page.goto('/login');
    await page.fill('input[name="email"]', '0000@example.com');
    await page.fill('input[name="password"]', '2136');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Navigate to a course (assuming first course in list)
    const courseLink = page.locator('a[href^="/courses/"]').first();
    await expect(courseLink).toBeVisible();

    await courseLink.click();
    await page.waitForLoadState('networkidle');

    const url = page.url();
    console.log('Current URL:', url);

    // Navigate directly to Community Page to avoid sidebar locator issues
    // Extracts ID from URL: http://.../courses/[id]/learn or /courses/[id]
    const courseId = url.split('/courses/')[1].split('/')[0];
    console.log('Navigating to Community for Course:', courseId);
    await page.goto(`/courses/${courseId}/community`);

    // 3. Create Post
    await page.waitForSelector('h1:has-text("コミュニティ")');
    await page.click('button:has-text("投稿を作成")');

    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Test Post ${timestamp}`);
    await page.fill('textarea[name="content"]', `Content ${timestamp}`);
    await page.click('button:has-text("投稿する")');

    // Verify post appears
    await expect(page.locator(`text=Test Post ${timestamp}`)).toBeVisible();

    // 4. View Post & Comment
    await page.click(`text=Test Post ${timestamp}`);
    await page.waitForSelector(`h1:has-text("Test Post ${timestamp}")`);

    await page.fill('textarea[name="content"]', `Comment ${timestamp}`);
    await page.click('button:has-text("コメントする")');

    // Verify comment appears
    await expect(page.locator(`text=Comment ${timestamp}`)).toBeVisible();

    // Screenshot
    await page.screenshot({ path: 'artifacts/community_flow.png', fullPage: true });
});
