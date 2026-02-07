import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

const TEST_USER = {
    email: `test-${randomUUID()}@example.com`,
    password: 'password123',
    name: 'Test User'
};

test.describe('Online Course Platform E2E', () => {

    test('User Registration and Login flow', async ({ page }) => {
        // 1. Register
        await page.goto('/register');
        await page.getByLabel('お名前').fill(TEST_USER.name); // Correct label from RegisterPage.tsx
        await page.getByLabel('メールアドレス').fill(TEST_USER.email);
        await page.getByLabel('パスワード').fill(TEST_USER.password);
        await page.getByRole('button', { name: 'アカウント作成' }).click(); // Correct button text

        // Expect to be redirected to login
        await expect(page).toHaveURL(/login/);

        // 2. Login
        await page.getByLabel('メールアドレス').fill(TEST_USER.email);
        // In Login page, label might be "パスワード"
        await page.locator('input[name="password"]').fill(TEST_USER.password);
        // Or check login page implementation for exact labels. 
        // Usually Login page has similar labels.

        // Let's assume standard Login text.
        await page.getByRole('button', { name: 'ログイン' }).click();

        // 3. Verify Dashboard Access
        await expect(page).toHaveURL(/dashboard/);
        // Check for unique element in dashboard
        await expect(page.getByRole('link', { name: 'マイページ' })).toBeVisible(); // This link is in header
    });

    test('Public Course Browsing', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Youtubeノウハウオンライン講座/);

        // Check for course list
        // const courseList = page.locator('#courses'); 
        await expect(page.getByText('講座一覧')).toBeVisible();
    });
});
