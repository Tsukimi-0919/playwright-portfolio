import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/hotel/LoginPage';
import { PlansPage } from '../../pages/hotel/PlansPage';
import { Header } from '../../pages/hotel/Header';
import { hotelUsers, type HotelUser } from '../../test-data/hotel-users';
import { visiblePlans, planId } from '../../test-data/plan-visibility';

/**
 * 会員ランクによるプランの見え方（docs/test-viewpoints.md の C-1〜C-7）
 */

async function loginAs(page: Page, user: HotelUser) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/mypage\.html/);
}

/** 表示順は問わず、見えるプランの集合が期待どおりかを確かめる */
async function expectVisiblePlans(page: Page, expected: string[]) {
  const plansPage = new PlansPage(page);
  await plansPage.goto();
  await expect(plansPage.planNames).toHaveCount(expected.length);
  expect((await plansPage.visiblePlanNames()).sort()).toEqual([...expected].sort());
}

const generalUser = hotelUsers.find((u) => u.rank === '一般会員')!;

test.describe('C. 会員ランクによるプランの見え方', () => {
  test.describe('プラン一覧', () => {
    test(`C-1 未ログインでは${visiblePlans.未ログイン.length}プランが表示される`, async ({ page }) => {
      await expectVisiblePlans(page, visiblePlans.未ログイン);
    });

    for (const user of hotelUsers) {
      const expected = visiblePlans[user.rank];
      const id = user.rank === '一般会員' ? 'C-2' : 'C-3';
      test(`${id} ${user.rank}（${user.email}）では${expected.length}プランが表示される`, async ({ page }) => {
        await loginAs(page, user);
        await expectVisiblePlans(page, expected);
      });
    }
  });

  test.describe('URLを直接開いたとき', () => {
    test('C-4 未ログインでディナー付きプランの予約画面を開くとトップページに戻される', async ({ page }) => {
      await page.goto(`reserve.html?plan-id=${planId.ディナー付きプラン}`);

      await expect(page).toHaveURL(/\/index\.html$/);
    });

    test(`C-5 一般会員でプレミアムプランの予約画面を開くとトップページに戻される`, async ({ page }) => {
      await loginAs(page, generalUser);

      await page.goto(`reserve.html?plan-id=${planId.プレミアムプラン}`);

      await expect(page).toHaveURL(/\/index\.html$/);
    });

    test('C-6 ログイン中に会員登録画面を開くとトップページに戻される', async ({ page }) => {
      await loginAs(page, generalUser);

      await page.goto('signup.html');

      await expect(page).toHaveURL(/\/index\.html$/);
    });
  });

  test('C-7 ログイン中はナビゲーションの「会員登録」が「マイページ」に変わる', async ({ page }) => {
    const header = new Header(page);

    // ログイン前
    await page.goto('index.html');
    await expect(header.signupLink).toBeVisible();
    await expect(header.mypageLink).toBeHidden();

    // ログイン後
    await loginAs(page, generalUser);
    await page.goto('index.html');
    await expect(header.signupLink).toBeHidden();
    await expect(header.mypageLink).toBeVisible();
  });
});
