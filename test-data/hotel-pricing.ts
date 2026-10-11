import type { WeekdayName } from './dates';

/**
 * 合計金額のテストケース。
 * docs/test-viewpoints.md の「A. 合計金額の計算」と同じ内容・同じ番号にしている。
 *
 * プラン：お得な特典付きプラン（1人1泊 平日7,000円／土日8,750円）
 * 追加プラン：1人1,000円（朝食は宿泊数分、チェックイン・観光は1回分）
 */
export type AddOn = '朝食' | 'チェックイン' | '観光';

export interface PricingCase {
  id: string;
  rule: string; // 確かめたいルール
  weekday: WeekdayName; // 宿泊日の曜日
  term: number; // 泊数
  headCount: number; // 人数
  addOns: AddOn[];
  expected: number; // 期待する合計（円）
}

export const pricingPlan = 'お得な特典付きプラン';

export const pricingCases: PricingCase[] = [
  { id: 'A-1', rule: '平日の基本料金', weekday: '水', term: 1, headCount: 1, addOns: [], expected: 7000 },
  { id: 'A-2', rule: '土曜は25%アップ', weekday: '土', term: 1, headCount: 1, addOns: [], expected: 8750 },
  { id: 'A-3', rule: '日曜も25%アップ', weekday: '日', term: 1, headCount: 1, addOns: [], expected: 8750 },
  { id: 'A-4', rule: '人数分かかる', weekday: '水', term: 1, headCount: 3, addOns: [], expected: 21000 },
  { id: 'A-5', rule: '平日→土日の混合（金・土・日）', weekday: '金', term: 3, headCount: 1, addOns: [], expected: 24500 },
  { id: 'A-6', rule: '土日→平日の混合（日・月）', weekday: '日', term: 2, headCount: 1, addOns: [], expected: 15750 },
  { id: 'A-7', rule: '朝食は泊数分かかる', weekday: '水', term: 2, headCount: 1, addOns: ['朝食'], expected: 16000 },
  { id: 'A-8', rule: '昼からチェックインは1回分', weekday: '水', term: 2, headCount: 1, addOns: ['チェックイン'], expected: 15000 },
  { id: 'A-9', rule: '観光プランは1回分', weekday: '水', term: 2, headCount: 1, addOns: ['観光'], expected: 15000 },
  { id: 'A-10', rule: '追加プランは土日でも割増しなし', weekday: '土', term: 1, headCount: 1, addOns: ['朝食'], expected: 9750 },
  { id: 'A-11', rule: 'すべての組み合わせ', weekday: '金', term: 2, headCount: 2, addOns: ['朝食', 'チェックイン', '観光'], expected: 39500 },
];

/** 画面の表示形式（例：39,500円）にする */
export function yen(amount: number): string {
  return `${amount.toLocaleString('ja-JP')}円`;
}
