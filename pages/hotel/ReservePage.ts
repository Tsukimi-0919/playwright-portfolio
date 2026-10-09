import type { Locator, Page } from '@playwright/test';

export type ContactMethod = 'no' | 'email' | 'tel';

export class ReservePage {
  readonly planName: Locator;
  readonly term: Locator;
  readonly headCount: Locator;
  readonly username: Locator;
  readonly contact: Locator;
  readonly email: Locator;
  readonly tel: Locator;
  readonly totalBill: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.planName = page.locator('#plan-name');
    this.term = page.getByLabel('宿泊数');
    this.headCount = page.getByLabel('人数');
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
}
