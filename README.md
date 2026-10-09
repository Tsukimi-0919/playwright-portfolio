# Playwright Portfolio

![Playwright Tests](https://github.com/<YOUR_GITHUB_ID>/playwright-portfolio/actions/workflows/playwright.yml/badge.svg)

Playwright（TypeScript）による E2E テストの学習ポートフォリオです。
QA エンジニアとして「何を・なぜ自動化するか」を設計し、実装・CI 運用までを一通り行っています。

- 📄 テスト戦略・観点表：[docs/test-strategy.md](docs/test-strategy.md)
- 📊 最新のテストレポート：https://<YOUR_GITHUB_ID>.github.io/playwright-portfolio/

## テスト対象

| 対象 | 位置づけ |
|---|---|
| [HOTEL PLANISPHERE](https://hotel-example-site.takeyaqa.dev/ja/) | **メイン**。ホテル予約サイトを模したテスト自動化練習サイト |
| [TodoMVC デモ](https://demo.playwright.dev/todomvc/) | Playwright の基本操作を練習した記録 |

## 工夫した点

- **Page Object Model** で画面操作とテストの意図を分離（`pages/hotel/`）
- **データ駆動テスト**：登録済みユーザー4件でログインを検証（`test-data/`）
- **新規ウィンドウ（popup）** の扱い：プラン一覧から予約画面への遷移
- **ユーザー視点のロケーター**（`getByRole` / `getByLabel`）を優先
- **GitHub Actions** で push / PR ごとに実行し、HTML レポートを GitHub Pages に公開

## ディレクトリ構成

```
├── docs/test-strategy.md   テスト戦略・観点表
├── pages/hotel/            Page Object
├── test-data/              テストデータ
├── tests/
│   ├── hotel/              HOTEL PLANISPHERE のテスト（メイン）
│   └── todomvc/            TodoMVC の練習
└── playwright.config.ts    プロジェクト（対象アプリ）ごとの設定
```

## 実行方法

```bash
npm ci
npx playwright install chromium

npm test               # すべて実行
npm run test:hotel     # HOTEL PLANISPHERE だけ
npm run test:ui        # UI モードで実行
npm run report         # HTML レポートを開く
```

## 今後やりたいこと

- [ ] 予約フォームの境界値テスト
- [ ] 合計金額の計算テスト（期待値表から）
- [ ] 会員ランク別のプラン表示テスト
- [ ] アクセシビリティチェック（axe）
- [ ] API テスト

## 謝辞

テスト対象として [HOTEL PLANISPHERE](https://github.com/takeyaqa/hotel-example-site)（MIT License）を利用しています。
