import type { Auction, Bid } from "../types";

export const NOW = new Date("2026-01-01T12:00:00.000Z");

export const minutesFromNow = (minutes: number): string =>
  new Date(NOW.getTime() + minutes * 60_000).toISOString();

export const makeBid = (user: string, amount: number, minutesAgo = 1): Bid => ({
  user,
  amount,
  at: minutesFromNow(-minutesAgo),
});

export const makeAuction = (overrides: Partial<Auction> = {}): Auction => ({
  id: 1,
  category: "electronics",
  title: "ساعت مچی کلاسیک",
  image: "",
  description: "ساعت مچی کلاسیک با بدنه‌ی استیل",
  startPrice: 1_000_000,
  bidStep: 100_000,
  endAt: minutesFromNow(60),
  bids: [],
  ...overrides,
});
