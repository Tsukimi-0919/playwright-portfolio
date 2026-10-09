import { test, expect } from '@playwright/test';
import { PlansPage } from '../../pages/hotel/PlansPage';

test.describe('宿泊予約', () => {
  test('「お得な特典付きプラン」の予約画面が新規ウィンドウで開く', async ({ page }) => {
    const plansPage = new PlansPage(page);
    await plansPage.goto();
    const reservePage = await plansPage.reserve('お得な特典付きプラン');

    await expect(reservePage.planName).toHaveText('お得な特典付きプラン');
  });

  test.describe('確認のご連絡の選択で入力欄が切り替わる', () => {
    test('メールを選ぶとメールアドレス欄だけが表示される', async ({ page }) => {
      const plansPage = new PlansPage(page);
      await plansPage.goto();
      const reservePage = await plansPage.reserve('お得な特典付きプラン');

      await reservePage.selectContact('email');

      await expect(reservePage.email).toBeVisible();
      await expect(reservePage.email).toBeEnabled();
      await expect(reservePage.tel).toBeHidden();
    });

    test('電話を選ぶと電話番号欄だけが表示される', async ({ page }) => {
      const plansPage = new PlansPage(page);
      await plansPage.goto();
      const reservePage = await plansPage.reserve('お得な特典付きプラン');

      await reservePage.selectContact('tel');

      await expect(reservePage.tel).toBeVisible();
      await expect(reservePage.tel).toBeEnabled();
      await expect(reservePage.email).toBeHidden();
    });
  });

  // TODO（テスト設計の練習）：
  // - 宿泊数・人数の境界値（下限-1 / 下限 / 上限 / 上限+1）
  // - 合計金額の計算（docs/test-strategy.md に期待値表を作ってからコード化）
  // - 会員ランクごとに表示されるプランの違い
});
