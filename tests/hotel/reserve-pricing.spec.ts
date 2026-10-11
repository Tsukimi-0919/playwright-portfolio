import { test, expect } from '@playwright/test';
import { PlansPage } from '../../pages/hotel/PlansPage';
import type { ReservePage } from '../../pages/hotel/ReservePage';
import { nextWeekday, formatForInput } from '../../test-data/dates';
import { pricingPlan, pricingCases, yen, type PricingCase } from '../../test-data/hotel-pricing';

/**
 * 合計金額の計算（docs/test-viewpoints.md の A-1〜A-12）
 */

async function openReservePage(page: import('@playwright/test').Page): Promise<ReservePage> {
  const plansPage = new PlansPage(page);
  await plansPage.goto();
  return plansPage.reserve(pricingPlan);
}

async function fillConditions(reservePage: ReservePage, c: PricingCase) {
  await reservePage.setDate(formatForInput(nextWeekday(c.weekday)));
  await reservePage.setTerm(c.term);
  await reservePage.setHeadCount(c.headCount);
  await reservePage.checkAddOns(c.addOns);
}

function describeCase(c: PricingCase): string {
  const addOns = c.addOns.length ? c.addOns.join('・') : '追加なし';
  return `${c.id} ${c.rule}：${c.weekday}曜から${c.term}泊・${c.headCount}人・${addOns} → ${yen(c.expected)}`;
}

test.describe('合計金額', () => {
  for (const c of pricingCases) {
    test(describeCase(c), async ({ page }) => {
      const reservePage = await openReservePage(page);

      await fillConditions(reservePage, c);

      await expect(reservePage.totalBill).toHaveText(yen(c.expected));
    });
  }

  test('A-12 確認画面の合計が予約画面と一致する', async ({ page }) => {
    const c = pricingCases.find((x) => x.id === 'A-11')!;
    const reservePage = await openReservePage(page);
    await fillConditions(reservePage, c);
    await expect(reservePage.totalBill).toHaveText(yen(c.expected));

    const confirmPage = await reservePage.goToConfirm();

    await expect(confirmPage.totalBill).toHaveText(`合計 ${yen(c.expected)}（税込み）`);
  });
});
