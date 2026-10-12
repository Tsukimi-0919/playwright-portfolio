/**
 * テスト用の日付ユーティリティ。
 *
 * 料金は宿泊日の曜日で変わるため、テストでは「曜日」で宿泊日を指定し、
 * 実行した日から見た「次のその曜日」を使う。こうすると、どの曜日に実行しても結果が変わらない。
 */

export const Weekday = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 } as const;
export type WeekdayName = keyof typeof Weekday;

/** サイトは日本時間で日付を判定するため、「今日」も日本時間で求める */
function todayInTokyo(): Date {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date()); // 2026-10-11
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * 次にくる指定の曜日の日付を返す。
 * 宿泊日は「翌日以降」しか選べないうえ、CI（UTC）と日本時間で日付がずれることがあるため、
 * 余裕をもって2日後〜8日後の範囲から選ぶ。
 */
export function nextWeekday(name: WeekdayName): Date {
  const today = todayInTokyo();
  for (let offset = 2; offset <= 8; offset++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + offset);
    if (date.getUTCDay() === Weekday[name]) return date;
  }
  throw new Error(`曜日が見つかりません: ${name}`);
}

/** 予約画面の入力形式（YYYY/MM/DD）にする */
export function formatForInput(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

/** 今日（日本時間）から n 日後の日付を返す（0 なら今日） */
export function daysFromToday(n: number): Date {
  const date = todayInTokyo();
  date.setUTCDate(date.getUTCDate() + n);
  return date;
}
