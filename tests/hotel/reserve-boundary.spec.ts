import { test, expect, type Locator } from '@playwright/test';
import { PlansPage } from '../../pages/hotel/PlansPage';
import type { ReservePage } from '../../pages/hotel/ReservePage';
import { boundaryPlans, boundaryCases, type BoundaryCase } from '../../test-data/hotel-plans';

/** 入力欄ごとの違い（どこに入力し、どこにエラーが出るか）をまとめる */
const fields = [
  {
    name: '宿泊数',
    range: (plan: (typeof boundaryPlans)[number]) => plan.term,
    input: (p: ReservePage, v: number) => p.setTerm(v),
    error: (p: ReservePage) => p.termError,
  },
  {
    name: '人数',
    range: (plan: (typeof boundaryPlans)[number]) => plan.headCount,
    input: (p: ReservePage, v: number) => p.setHeadCount(v),
    error: (p: ReservePage) => p.headCountError,
  },
];

async function expectResult(c: BoundaryCase, error: Locator, totalBill: Locator) {
  if (c.valid) {
    // 範囲内：エラーが出ず、合計金額が計算される
    await expect(error).toBeHidden();
    await expect(totalBill).not.toHaveText('-');
  } else {
    // 範囲外：エラーメッセージが出て、合計金額は「-」になる
    await expect(error).toBeVisible();
    await expect(error).toHaveText(c.message);
    await expect(totalBill).toHaveText('-');
  }
}

for (const plan of boundaryPlans) {
  test.describe(`境界値：${plan.name}`, () => {
    for (const field of fields) {
      const range = field.range(plan);

      for (const c of boundaryCases(range)) {
        const result = c.valid ? '受け付ける' : 'エラーになる';
        test(`${field.name} ${c.value}（${c.label}）は${result}`, async ({ page }) => {
          const plansPage = new PlansPage(page);
          await plansPage.goto();
          const reservePage = await plansPage.reserve(plan.name);

          await field.input(reservePage, c.value);

          await expectResult(c, field.error(reservePage), reservePage.totalBill);
        });
      }
    }
  });
}
