import { test, expect } from '@playwright/test';

/**
 * TodoMVC は Playwright の基本操作を覚えるための練習。
 * 公式サンプル（tests-examples/demo-todo-app.spec.ts）を読んだうえで、
 * 自分で書き直したテストだけをここに置く。
 */
test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('Todoを追加すると一覧に表示される', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('PSM I の模擬試験を解く');
  await input.press('Enter');

  await expect(page.getByTestId('todo-title')).toHaveText(['PSM I の模擬試験を解く']);
});

test('1件完了にすると Active フィルターで残りだけが表示される', async ({ page }) => {
  const input = page.getByPlaceholder('What needs to be done?');
  for (const title of ['ロケーターを学ぶ', 'アサーションを学ぶ', 'CIを設定する']) {
    await input.fill(title);
    await input.press('Enter');
  }

  await page.getByTestId('todo-item').filter({ hasText: 'ロケーターを学ぶ' }).getByRole('checkbox').check();
  await page.getByRole('link', { name: 'Active' }).click();

  await expect(page.getByTestId('todo-title')).toHaveText(['アサーションを学ぶ', 'CIを設定する']);
});
