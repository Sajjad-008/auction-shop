import type { Auction, MyStatus } from "../types";

export const ME = "من";

export const getCurrentPrice = (a: Auction): number =>
  a.bids.length ? a.bids[0].amount : a.startPrice;

export const getMinNextBid = (a: Auction): number =>
  a.bids.length ? a.bids[0].amount + a.bidStep : a.startPrice;

export const isEnded = (a: Auction): boolean =>
  new Date(a.endAt).getTime() <= Date.now();

export const formatToman = (n: number): string =>
  `${n.toLocaleString("fa-IR")} تومان`;

// ورودی کاربر رو (حتی با ارقام فارسی و جداکننده) به رشته‌ی ارقام انگلیسی تبدیل می‌کنه
export const toEnglishDigits = (s: string): string =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/\D/g, "");

export const timeAgo = (iso: string): string => {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "همین الان";
  if (min < 60) return `${min.toLocaleString("fa-IR")} دقیقه پیش`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours.toLocaleString("fa-IR")} ساعت پیش`;
  return `${Math.floor(hours / 24).toLocaleString("fa-IR")} روز پیش`;
};

// وضعیت من در یک مزایده: null / leading / outbid / won / lost
export const getMyStatus = (a: Auction): MyStatus | null => {
  if (!a.bids.some((b) => b.user === ME)) return null;
  const top = a.bids[0].user === ME;
  if (isEnded(a)) return top ? "won" : "lost";
  return top ? "leading" : "outbid";
};

export const getMyBestBid = (a: Auction): number =>
  Math.max(...a.bids.filter((b) => b.user === ME).map((b) => b.amount));
