import type { Locator, Page } from '@playwright/test';

/** 画面上部のナビゲーション（全画面共通） */
export class Header {
  readonly signupLink: Locator;
  readonly mypageLink: Locator;

  constructor(page: Page) {
    const nav = page.locator('#navbarNav');
    this.signupLink = nav.getByRole('link', { name: '会員登録' });
    this.mypageLink = nav.getByRole('link', { name: 'マイページ' });
  }
}
