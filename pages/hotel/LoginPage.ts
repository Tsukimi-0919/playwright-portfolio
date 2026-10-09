import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(private readonly page: Page) {
    // ナビゲーションの「ログイン」リンクも role="button" を持つため、
    // ログインフォームの中に範囲を絞って特定する
    this.form = page.locator('#login-form');
    this.email = this.form.getByLabel('メールアドレス');
    this.password = this.form.getByLabel('パスワード');
    this.submit = this.form.getByRole('button', { name: 'ログイン' });
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