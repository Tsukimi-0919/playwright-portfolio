import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 練習サイトに負荷をかけないよう、並列数は控えめにする
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'todomvc',
      testDir: './tests/todomvc',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demo.playwright.dev/todomvc/',
      },
    },
    {
      name: 'hotel',
      testDir: './tests/hotel',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://hotel-example-site.takeyaqa.dev/ja/',
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
      },
    },
  ],
});
