import { test, expect } from '@playwright/test';

test('Capture Screenshots', async ({ page }) => {
    // 1. Home Page
    await page.goto('/');
    await page.screenshot({ path: 'screenshots/home.png', fullPage: true });

    // 2. Course List
    await page.goto('/courses');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/courses.png', fullPage: true });

    // 3. Contact
    await page.goto('/contact');
    await page.screenshot({ path: 'screenshots/contact.png', fullPage: true });

    // 4. Admin Dashboard (Login required)
    await page.goto('/login');
    await page.getByLabel('メールアドレス').fill('0000@example.com');
    await page.locator('input[name="password"]').fill('2136');
    await page.getByRole('button', { name: 'ログイン' }).click();

    // Wait for dashboard and check URL to confirm login
    await expect(page).toHaveURL(/dashboard/);

    // Go to Admin
    await page.goto('/admin');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/admin_dashboard.png', fullPage: true });

    await page.goto('/admin/courses');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/admin_courses.png', fullPage: true });

    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/admin_users.png', fullPage: true });
});
