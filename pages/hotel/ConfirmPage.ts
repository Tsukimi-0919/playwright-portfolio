import type { Locator, Page } from '@playwright/test';

export class ConfirmPage {
  /** 例：「合計 39,500円（税込み）」 */
  readonly totalBill: Locator;

  constructor(readonly page: Page) {
    this.totalBill = page.locator('#total-bill');
  }
}
