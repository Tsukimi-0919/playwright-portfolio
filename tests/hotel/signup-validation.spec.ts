import { test, expect } from '@playwright/test';
import { SignupPage, type SignupInput } from '../../pages/hotel/SignupPage';

/**
 * 会員登録の入力チェック（docs/test-viewpoints.md の B-2）
 */

const REQUIRED = 'このフィールドを入力してください。';
const INVALID_FORMAT = '指定されている形式で入力してください。';

/** すべて正しい入力。各テストでは、確かめたい項目だけをこれから変える */
function validInput(overrides: Partial<SignupInput> = {}): SignupInput {
  return {
    // テストごとに別のアドレスにして、重複チェックに引っかからないようにする
    email: `test-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'pass1234', // 8文字（下限ちょうど）
    passwordConfirmation: 'pass1234',
    username: 'テスト太郎',
    tel: '01133335555', // 11桁
    ...overrides,
  };
}

let signupPage: SignupPage;

test.beforeEach(async ({ page }) => {
  signupPage = new SignupPage(page);
  await signupPage.goto();
});

test.describe('B-2 会員登録の入力チェック', () => {
  test(`B-2-1 必須4項目が空欄だと、それぞれ「${REQUIRED}」が表示される`, async () => {
    await signupPage.submit.click();

    for (const error of [
      signupPage.emailError,
      signupPage.passwordError,
      signupPage.passwordConfirmationError,
      signupPage.usernameError,
    ]) {
      await expect(error).toHaveText(REQUIRED);
      await expect(error).toBeVisible();
    }
    await expect(signupPage.page).toHaveURL(/signup\.html/);
  });

  test('B-2-2 パスワードが7文字だと「8文字以上で入力してください。」が表示される', async () => {
    await signupPage.fill(validInput({ password: 'pass123', passwordConfirmation: 'pass123' }));

    await signupPage.submit.click();

    await expect(signupPage.passwordError).toHaveText('8文字以上で入力してください。');
    await expect(signupPage.passwordError).toBeVisible();
    await expect(signupPage.page).toHaveURL(/signup\.html/);
  });

  test.describe(`B-2-3・B-2-4 電話番号が11桁の半角数字でないと「${INVALID_FORMAT}」が表示される`, () => {
    const cases = [
      { label: '10桁', tel: '0113333555' },
      { label: '12桁', tel: '011333355556' },
      { label: 'ハイフンあり', tel: '011-3333-5555' },
      { label: '全角数字', tel: '０１１３３３３５５５５' },
      { label: 'ひらがな', tel: 'でんわばんごう' },
    ];

    for (const c of cases) {
      test(c.label, async () => {
        await signupPage.fill(validInput({ tel: c.tel }));

        await signupPage.submit.click();

        await expect(signupPage.telError).toHaveText(INVALID_FORMAT);
        await expect(signupPage.telError).toBeVisible();
        await expect(signupPage.page).toHaveURL(/signup\.html/);
      });
    }
  });

  test('B-2-3 エラー表示後に電話番号を11桁に直すと、エラーが消える', async () => {
    await signupPage.fill(validInput({ tel: '0113333555' }));
    await signupPage.submit.click();
    await expect(signupPage.telError).toBeVisible();

    await signupPage.tel.fill('01133335555');

    await expect(signupPage.telError).toBeHidden();
  });

  test('B-2-5 登録済みのメールアドレスだと「このメールアドレスはすでに登録済みです。」が表示される', async () => {
    await signupPage.fill(validInput({ email: 'ichiro@example.com' }));

    await signupPage.submit.click();

    await expect(signupPage.emailError).toHaveText('このメールアドレスはすでに登録済みです。');
    await expect(signupPage.emailError).toBeVisible();
    await expect(signupPage.page).toHaveURL(/signup\.html/);
  });

  test('B-2-6 パスワード（確認）が一致しないと「入力されたパスワードと一致しません。」が表示される', async () => {
    await signupPage.fill(validInput({ password: 'pass1234', passwordConfirmation: 'pass5678' }));

    await signupPage.submit.click();

    await expect(signupPage.passwordConfirmationError).toHaveText('入力されたパスワードと一致しません。');
    await expect(signupPage.passwordConfirmationError).toBeVisible();
    await expect(signupPage.page).toHaveURL(/signup\.html/);
  });

  test('B-2-8 メールアドレスに「@」がないと「メールアドレスを入力してください。」が表示される', async () => {
    await signupPage.fill(validInput({ email: 'test.example.com' }));

    await signupPage.submit.click();

    await expect(signupPage.emailError).toHaveText('メールアドレスを入力してください。');
    await expect(signupPage.emailError).toBeVisible();
    await expect(signupPage.page).toHaveURL(/signup\.html/);
  });

  test('B-2-7 すべて正しく入力すると登録でき、マイページに遷移する（パスワード8文字・電話番号11桁）', async () => {
    await signupPage.fill(validInput());

    await signupPage.submit.click();

    await expect(signupPage.page).toHaveURL(/mypage\.html/);
  });
});
