import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/hotel/LoginPage';
import { hotelUsers } from '../../test-data/hotel-users';

test.describe('ログイン', () => {
  // データ駆動：登録済みユーザー全員でログインできること
  for (const user of hotelUsers) {
    test(`${user.rank}（${user.email}）でログインするとマイページに遷移する`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.email, user.password);

      await expect(page).toHaveURL(/mypage\.html/);
    });
  }

  test('パスワードが誤っているとマイページに遷移しない', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('ichiro@example.com', 'wrong-password');

    await expect(page).not.toHaveURL(/mypage\.html/);
    // TODO: エラーメッセージの表示も確認する（codegen で文言とロケーターを調べてみよう）
  });
});
