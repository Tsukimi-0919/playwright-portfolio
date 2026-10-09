import type { Locator, Page } from '@playwright/test';

export type ContactMethod = 'no' | 'email' | 'tel';

export class ReservePage {
  readonly planName: Locator;
  readonly term: Locator;
  readonly termError: Locator;
  readonly headCount: Locator;
  readonly headCountError: Locator;
  readonly username: Locator;
  readonly contact: Locator;
  readonly email: Locator;
  readonly tel: Locator;
  readonly totalBill: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.planName = page.locator('#plan-name');
    this.term = page.getByLabel('宿泊数');
    this.termError = page.locator('#term ~ .invalid-feedback');
    this.headCount = page.getByLabel('人数');
    this.headCountError = page.locator('#head-count ~ .invalid-feedback');
    this.username = page.getByLabel('氏名');
    this.contact = page.getByLabel('確認のご連絡');
    this.email = page.getByLabel('メールアドレス');
    this.tel = page.getByLabel('電話番号');
    this.totalBill = page.locator('#total-bill');
    this.submit = page.getByRole('button', { name: '予約内容を確認する' });
  }

  async selectContact(method: ContactMethod) {
    await this.contact.selectOption(method);
  }

  /**
   * 入力して Tab でフォーカスを外す。
   * このサイトは入力欄の change イベントでチェックと合計金額の計算を行うため、
   * fill だけではチェックが動かない。
   */
  async setTerm(value: number) {
    await this.term.fill(String(value));
    await this.term.press('Tab');
  }

  async setHeadCount(value: number) {
    await this.headCount.fill(String(value));
    await this.headCount.press('Tab');
  }
}
