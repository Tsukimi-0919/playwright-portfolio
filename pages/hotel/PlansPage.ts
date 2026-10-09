import { expect, type Page } from '@playwright/test';
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
      .filter({ has: this.page.getByRole('heading', { name: planName, exact: true }) });

    const popupPromise = this.page.waitForEvent('popup');
    await card.getByRole('link', { name: 'このプランで予約' }).click();
    const popup = await popupPromise;
    const reservePage = new ReservePage(popup);
    // プラン情報は非同期で読み込まれ、読み込み後に宿泊数・人数の初期値と上限・下限が設定される。
    // 読み込み完了の合図として「予約内容を確認する」ボタンが押せるようになるまで待つ。
    await expect(reservePage.submit).toBeEnabled();
    return reservePage;
  }
}
