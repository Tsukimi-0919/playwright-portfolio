import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    this.email = page.getByLabel('メールアドレス');
    this.password = page.getByLabel('パスワード');
    // ナビゲーションの「ログイン」はリンクなので、role で区別できる
    this.submit = page.getByRole('button', { name: 'ログイン' });
  }

  async goto() {
    await this.page.goto('login.html');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
