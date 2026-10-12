/**
 * 会員ランクによるプランの見え方。
 * docs/test-viewpoints.md の「C. 会員ランクによるプランの見え方」に対応。
 */

/** だれでも見えるプラン（7） */
export const publicPlans = [
  'お得な特典付きプラン',
  '素泊まり',
  '出張ビジネスプラン',
  'エステ・マッサージプラン',
  '貸し切り露天風呂プラン',
  'カップル限定プラン',
  'テーマパーク優待プラン',
];

/** 会員（一般・プレミアム）だけに見えるプラン */
export const memberPlans = ['ディナー付きプラン', 'お得なプラン'];

/** プレミアム会員だけに見えるプラン */
export const premiumPlans = ['プレミアムプラン'];

export const visiblePlans = {
  未ログイン: publicPlans, // 7
  一般会員: [...publicPlans, ...memberPlans], // 9
  プレミアム会員: [...publicPlans, ...memberPlans, ...premiumPlans], // 10
};

/** 予約画面の URL で使うプラン番号 */
export const planId = {
  プレミアムプラン: 1,
  ディナー付きプラン: 2,
};
