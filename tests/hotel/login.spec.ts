import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/hotel/LoginPage';
import { hotelUsers } from '../../test-data/hotel-users';

/**
 * ログイン（docs/test-viewpoints.md の B-3）
 */
test.describe('B-3 ログイン', () => {
  // データ駆動：登録済みユーザー全員でログインできること
  for (const user of hotelUsers) {
    test(`B-3-1 ${user.rank}（${user.email}）でログインするとマイページに遷移する`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.email, user.password);

      await expect(page).toHaveURL(/mypage\.html/);
    });
  }

  test('B-3-2 パスワードが誤っていると「メールアドレスまたはパスワードが違います。」が表示され、マイページに遷移しない', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('ichiro@example.com', 'wrong-password');

    // どちらが違うかを利用者に教えないよう、メールアドレスとパスワードの両方に同じ文言が出る
    for (const error of [loginPage.emailError, loginPage.passwordError]) {
      await expect(error).toHaveText('メールアドレスまたはパスワードが違います。');
      await expect(error).toBeVisible();
    }
    await expect(page).not.toHaveURL(/mypage\.html/);
  });

  test('B-3-3 何も入力しないと「このフィールドを入力してください。」が表示される', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.submit.click();

    for (const error of [loginPage.emailError, loginPage.passwordError]) {
      await expect(error).toHaveText('このフィールドを入力してください。');
      await expect(error).toBeVisible();
    }
    await expect(page).not.toHaveURL(/mypage\.html/);
  });
});
