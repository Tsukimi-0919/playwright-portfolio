/**
 * 境界値テストの対象プラン。
 * 未ログインでも予約できるプランから、条件の異なる3つを選んでいる。
 * 値はプラン一覧・予約画面の説明文で確認したもの。
 */
export interface Range {
  min: number;
  max: number;
}

export interface HotelPlan {
  name: string;
  term: Range; // 宿泊数
  headCount: Range; // 人数
}

export const boundaryPlans: HotelPlan[] = [
  // 標準的な範囲
  { name: 'お得な特典付きプラン', term: { min: 1, max: 9 }, headCount: { min: 1, max: 9 } },
  // 人数の上限が小さい
  { name: '素泊まり', term: { min: 1, max: 9 }, headCount: { min: 1, max: 2 } },
  // 人数の下限と上限が同じ（2名ちょうど）
  { name: 'カップル限定プラン', term: { min: 1, max: 2 }, headCount: { min: 2, max: 2 } },
];

export type BoundaryCase =
  | { value: number; valid: true; label: string }
  | { value: number; valid: false; label: string; message: string };

/**
 * 範囲から「下限-1 / 下限 / 上限 / 上限+1」の4ケースを作る。
 * 下限と上限が同じときは重複を除く。
 */
export function boundaryCases({ min, max }: Range): BoundaryCase[] {
  const cases: BoundaryCase[] = [
    { value: min - 1, valid: false, label: '下限-1', message: `${min}以上の値を入力してください。` },
    { value: min, valid: true, label: '下限' },
    { value: max, valid: true, label: '上限' },
    { value: max + 1, valid: false, label: '上限+1', message: `${max}以下の値を入力してください。` },
  ];
  return cases.filter((c, i) => cases.findIndex((d) => d.value === c.value) === i);
}
