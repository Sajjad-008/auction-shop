import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ME,
  formatToman,
  getCurrentPrice,
  getMinNextBid,
  getMyBestBid,
  getMyStatus,
  isEnded,
  timeAgo,
  toEnglishDigits,
} from "./auction";
import { NOW, makeAuction, makeBid, minutesFromNow } from "../test/fixtures";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getCurrentPrice", () => {
  it("returns the start price when there are no bids", () => {
    expect(getCurrentPrice(makeAuction({ startPrice: 1_000_000 }))).toBe(
      1_000_000,
    );
  });

  it("returns the newest (first) bid amount", () => {
    const auction = makeAuction({
      bids: [makeBid("ک***ی", 1_300_000), makeBid("م***ا", 1_200_000)],
    });
    expect(getCurrentPrice(auction)).toBe(1_300_000);
  });
});

describe("getMinNextBid", () => {
  it("equals the start price when there are no bids", () => {
    expect(getMinNextBid(makeAuction({ startPrice: 1_000_000 }))).toBe(
      1_000_000,
    );
  });

  it("adds the bid step to the highest bid", () => {
    const auction = makeAuction({
      startPrice: 1_000_000,
      bidStep: 100_000,
      bids: [makeBid("ک***ی", 1_300_000)],
    });
    expect(getMinNextBid(auction)).toBe(1_400_000);
  });
});

describe("isEnded", () => {
  it("is false before the end time", () => {
    expect(isEnded(makeAuction({ endAt: minutesFromNow(1) }))).toBe(false);
  });

  it("is true exactly at the end time", () => {
    expect(isEnded(makeAuction({ endAt: minutesFromNow(0) }))).toBe(true);
  });

  it("is true after the end time", () => {
    expect(isEnded(makeAuction({ endAt: minutesFromNow(-1) }))).toBe(true);
  });
});

describe("getMyStatus", () => {
  const rival = "ک***ی";

  it("is null when I have not bid", () => {
    expect(
      getMyStatus(makeAuction({ bids: [makeBid(rival, 1_200_000)] })),
    ).toBeNull();
  });

  it('is "leading" while I hold the top bid in a running auction', () => {
    const auction = makeAuction({
      bids: [makeBid(ME, 1_300_000), makeBid(rival, 1_200_000)],
    });
    expect(getMyStatus(auction)).toBe("leading");
  });

  it('is "outbid" when someone else holds the top bid in a running auction', () => {
    const auction = makeAuction({
      bids: [makeBid(rival, 1_300_000), makeBid(ME, 1_200_000)],
    });
    expect(getMyStatus(auction)).toBe("outbid");
  });

  it('is "won" when I held the top bid at the end', () => {
    const auction = makeAuction({
      endAt: minutesFromNow(-5),
      bids: [makeBid(ME, 1_300_000), makeBid(rival, 1_200_000)],
    });
    expect(getMyStatus(auction)).toBe("won");
  });

  it('is "lost" when someone else held the top bid at the end', () => {
    const auction = makeAuction({
      endAt: minutesFromNow(-5),
      bids: [makeBid(rival, 1_300_000), makeBid(ME, 1_200_000)],
    });
    expect(getMyStatus(auction)).toBe("lost");
  });
});

describe("getMyBestBid", () => {
  it("returns the highest amount among my bids", () => {
    const auction = makeAuction({
      bids: [
        makeBid("ک***ی", 1_400_000),
        makeBid(ME, 1_300_000),
        makeBid(ME, 1_100_000),
      ],
    });
    expect(getMyBestBid(auction)).toBe(1_300_000);
  });
});

describe("toEnglishDigits", () => {
  it("converts Persian digits and drops separators", () => {
    expect(toEnglishDigits("۱۲٬۵۰۰")).toBe("12500");
  });

  it("converts Arabic-Indic digits", () => {
    expect(toEnglishDigits("١٢٣")).toBe("123");
  });

  it("removes everything that is not a digit", () => {
    expect(toEnglishDigits("ab12 c3")).toBe("123");
  });
});

describe("formatToman", () => {
  it("formats zero with a Persian digit and the currency word", () => {
    expect(formatToman(0)).toBe("۰ تومان");
  });

  it("uses Persian digits for larger amounts", () => {
    const text = formatToman(1_500_000);
    expect(text).toContain("۱");
    expect(text.endsWith("تومان")).toBe(true);
  });
});

describe("timeAgo", () => {
  it('says "just now" for the current moment', () => {
    expect(timeAgo(minutesFromNow(0))).toBe("همین الان");
  });

  it("uses minutes under an hour", () => {
    expect(timeAgo(minutesFromNow(-5))).toMatch(/دقیقه پیش$/);
  });

  it("uses hours under a day", () => {
    expect(timeAgo(minutesFromNow(-120))).toMatch(/ساعت پیش$/);
  });

  it("uses days beyond a day", () => {
    expect(timeAgo(minutesFromNow(-3 * 24 * 60))).toMatch(/روز پیش$/);
  });
});
