import { expect, type Locator, type Page } from '@playwright/test';
import { ReservePage } from './ReservePage';

export class PlansPage {
  /** プランカードの見出し（プラン名） */
  readonly planNames: Locator;
  /** プラン読み込み中のスピナー */
  readonly loading: Locator;

  constructor(private readonly page: Page) {
    this.planNames = page.locator('.card').getByRole('heading', { level: 5 });
    this.loading = page.getByRole('status');
  }

  async goto() {
    await this.page.goto('plans.html');
    // おすすめ以外のプランは後から非同期で読み込まれるため、読み込みが終わるまで待つ
    await expect(this.loading).toBeHidden();
  }

  /** 表示されているプラン名の一覧 */
  async visiblePlanNames(): Promise<string[]> {
    return (await this.planNames.allTextContents()).map((name) => name.trim());
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
