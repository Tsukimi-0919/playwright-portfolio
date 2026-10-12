import type { Locator, Page } from '@playwright/test';

export interface SignupInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  username: string;
  tel?: string;
}

export class SignupPage {
  readonly email: Locator;
  readonly emailError: Locator;
  readonly password: Locator;
  readonly passwordError: Locator;
  readonly passwordConfirmation: Locator;
  readonly passwordConfirmationError: Locator;
  readonly username: Locator;
  readonly usernameError: Locator;
  readonly tel: Locator;
  readonly telError: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    // 「パスワード」と「パスワード（確認）」を区別するため、ラベルは完全一致で探す
    this.email = page.getByLabel('メールアドレス 必須', { exact: true });
    this.password = page.getByLabel('パスワード 必須', { exact: true });
    this.passwordConfirmation = page.getByLabel('パスワード（確認） 必須', { exact: true });
    this.username = page.getByLabel('氏名 必須', { exact: true });
    this.tel = page.getByLabel('電話番号', { exact: true });
    this.submit = page.getByRole('button', { name: '登録' });

    this.emailError = page.locator('#email ~ .invalid-feedback');
    this.passwordError = page.locator('#password ~ .invalid-feedback');
    this.passwordConfirmationError = page.locator('#password-confirmation ~ .invalid-feedback');
    this.usernameError = page.locator('#username ~ .invalid-feedback');
    this.telError = page.locator('#tel ~ .invalid-feedback');
  }

  async goto() {
    await this.page.goto('signup.html');
  }

  async fill(input: SignupInput) {
    await this.email.fill(input.email);
    await this.password.fill(input.password);
    await this.passwordConfirmation.fill(input.passwordConfirmation);
    await this.username.fill(input.username);
    if (input.tel !== undefined) {
      await this.tel.fill(input.tel);
    }
  }
}
