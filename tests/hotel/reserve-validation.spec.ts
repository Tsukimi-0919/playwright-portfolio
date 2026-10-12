import { test, expect } from '@playwright/test';
import { PlansPage } from '../../pages/hotel/PlansPage';
import type { ReservePage } from '../../pages/hotel/ReservePage';
import { daysFromToday, formatForInput } from '../../test-data/dates';

/**
 * 宿泊予約画面の入力チェック（docs/test-viewpoints.md の B-1-2〜B-1-8）
 */

const REQUIRED = 'このフィールドを入力してください。';

let reservePage: ReservePage;

test.beforeEach(async ({ page }) => {
  const plansPage = new PlansPage(page);
  await plansPage.goto();
  reservePage = await plansPage.reserve('お得な特典付きプラン');
});

test.describe('B-1 宿泊予約の入力チェック', () => {
  test.describe('必須（空欄にしてフォーカスを外す）', () => {
    const fields = [
      { id: 'B-1-2', name: '宿泊日', input: (p: ReservePage) => p.date, error: (p: ReservePage) => p.dateError },
      { id: 'B-1-3', name: '宿泊数', input: (p: ReservePage) => p.term, error: (p: ReservePage) => p.termError },
      { id: 'B-1-4', name: '人数', input: (p: ReservePage) => p.headCount, error: (p: ReservePage) => p.headCountError },
    ];

    for (const f of fields) {
      test(`${f.id} ${f.name}が空欄だと「${REQUIRED}」が表示される`, async () => {
        await reservePage.clear(f.input(reservePage));

        await expect(f.error(reservePage)).toHaveText(REQUIRED);
        await expect(f.error(reservePage)).toBeVisible();
      });
    }
  });

  test.describe('必須（確認ボタンを押したとき）', () => {
    test(`B-1-5 氏名が空欄だと「${REQUIRED}」が表示され、確認画面に進まない`, async () => {
      await reservePage.selectContact('no');

      await reservePage.submit.click();

      await expect(reservePage.usernameError).toHaveText(REQUIRED);
      await expect(reservePage.usernameError).toBeVisible();
      await expect(reservePage.page).toHaveURL(/reserve\.html/);
    });

    test('B-1-6 確認のご連絡が未選択だと入力エラーになり、確認画面に進まない', async () => {
      await reservePage.username.fill('テスト太郎');

      await reservePage.submit.click();

      // 画面上は枠が赤くなるだけでメッセージは出ないため、
      // 「フォームがチェック済みの表示になった」ことと「入力欄がエラー状態である」ことを確かめる
      await expect(reservePage.page.locator('#reserve-form')).toHaveClass(/was-validated/);
      await expect(reservePage.contact).toHaveJSProperty('validity.valid', false);
      await expect(reservePage.page).toHaveURL(/reserve\.html/);
    });
  });

  test.describe('B-1-7 宿泊日の範囲（翌日〜90日後）', () => {
    const cases = [
      { label: '当日', days: 0, error: '翌日以降の日付を入力してください。' },
      { label: '翌日', days: 1, error: null },
      { label: '90日後', days: 90, error: null },
      { label: '91日後', days: 91, error: '3ヶ月以内の日付を入力してください。' },
    ];

    for (const c of cases) {
      const result = c.error ? `「${c.error}」が表示される` : 'エラーにならない';
      test(`${c.label}は${result}`, async () => {
        await reservePage.setDate(formatForInput(daysFromToday(c.days)));

        if (c.error) {
          await expect(reservePage.dateError).toHaveText(c.error);
          await expect(reservePage.dateError).toBeVisible();
          await expect(reservePage.totalBill).toHaveText('-');
        } else {
          await expect(reservePage.dateError).toBeHidden();
          await expect(reservePage.totalBill).not.toHaveText('-');
        }
      });
    }
  });

  test('B-1-8 ご要望は140文字までしか入力できない', async () => {
    const text141 = 'あ'.repeat(140) + 'い';

    await reservePage.comment.fill(text141);

    await expect(reservePage.comment).toHaveValue('あ'.repeat(140));
  });
});
