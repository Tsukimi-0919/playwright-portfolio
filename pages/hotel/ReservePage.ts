import type { Locator, Page } from '@playwright/test';
import type { AddOn } from '../../test-data/hotel-pricing';
import { ConfirmPage } from './ConfirmPage';

export type ContactMethod = 'no' | 'email' | 'tel';

export class ReservePage {
  readonly planName: Locator;
  readonly date: Locator;
  readonly dateError: Locator;
  readonly term: Locator;
  readonly termError: Locator;
  readonly headCount: Locator;
  readonly headCountError: Locator;
  readonly addOns: Record<AddOn, Locator>;
  readonly username: Locator;
  readonly usernameError: Locator;
  readonly contact: Locator;
  readonly email: Locator;
  readonly tel: Locator;
  readonly comment: Locator;
  readonly totalBill: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.planName = page.locator('#plan-name');
    this.date = page.getByLabel('宿泊日');
    this.dateError = page.locator('#date ~ .invalid-feedback');
    this.term = page.getByLabel('宿泊数');
    this.termError = page.locator('#term ~ .invalid-feedback');
    this.headCount = page.getByLabel('人数');
    this.headCountError = page.locator('#head-count ~ .invalid-feedback');
    this.addOns = {
      朝食: page.getByLabel('朝食バイキング'),
      チェックイン: page.getByLabel('昼からチェックインプラン'),
      観光: page.getByLabel('お得な観光プラン'),
    };
    this.username = page.getByLabel('氏名');
    this.usernameError = page.locator('#username ~ .invalid-feedback');
    this.contact = page.getByLabel('確認のご連絡');
    this.email = page.getByLabel('メールアドレス');
    this.tel = page.getByLabel('電話番号');
    this.comment = page.getByLabel('ご要望・ご連絡事項等ありましたらご記入ください');
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
   * 宿泊日の欄はカレンダーが開くが、Tab で閉じられる。
   */
  async setDate(value: string) {
    await this.date.fill(value);
    await this.date.press('Tab');
  }

  /** 入力欄を空にしてフォーカスを外す */
  async clear(field: Locator) {
    await field.fill('');
    await field.press('Tab');
  }

  async setTerm(value: number) {
    await this.term.fill(String(value));
    await this.term.press('Tab');
  }

  async setHeadCount(value: number) {
    await this.headCount.fill(String(value));
    await this.headCount.press('Tab');
  }

  async checkAddOns(addOns: AddOn[]) {
    for (const addOn of addOns) {
      await this.addOns[addOn].check();
    }
  }

  /** 必須項目を埋めて確認画面へ進む（氏名と、確認のご連絡は「希望しない」） */
  async goToConfirm(username = 'テスト太郎'): Promise<ConfirmPage> {
    await this.username.fill(username);
    await this.selectContact('no');
    await this.submit.click();
    return new ConfirmPage(this.page);
  }
}
