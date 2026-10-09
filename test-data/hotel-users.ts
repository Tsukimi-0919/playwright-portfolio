/**
 * HOTEL PLANISPHERE のトップページで公開されている「登録済みユーザ」。
 * 練習サイト用のダミーアカウントなので、リポジトリに含めて問題ない。
 * （実在サービスの認証情報は、絶対にコードへ書かないこと）
 */
export type MemberRank = 'プレミアム会員' | '一般会員';

export interface HotelUser {
  email: string;
  password: string;
  rank: MemberRank;
}

export const hotelUsers: HotelUser[] = [
  { email: 'ichiro@example.com', password: 'password', rank: 'プレミアム会員' },
  { email: 'sakura@example.com', password: 'pass1234', rank: '一般会員' },
  { email: 'jun@example.com', password: 'pa55w0rd!', rank: 'プレミアム会員' },
  { email: 'yoshiki@example.com', password: 'pass-pass', rank: '一般会員' },
];
