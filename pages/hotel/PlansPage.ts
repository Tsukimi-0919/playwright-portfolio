import type { Page } from '@playwright/test';
import { ReservePage } from './ReservePage';

export class PlansPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('plans.html');
  }

  /**
   * プランカードの「このプランで予約」を押す。
   * 予約画面は新規ウィンドウで開くので、popup を待ち受けてから返す。
   */
  async reserve(planName: string): Promise<ReservePage> {
    const card = this.page
      .locator('.card')
      .filter({ has: this.page.getByRole('heading', { name: planName }) });

    const popupPromise = this.page.waitForEvent('popup');
    await card.getByRole('link', { name: 'このプランで予約' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    return new ReservePage(popup);
  }
}
