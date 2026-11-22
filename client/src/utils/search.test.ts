import { describe, expect, it } from "vitest";
import { matches, normalize } from "./search";
import { makeAuction } from "../test/fixtures";

describe("normalize", () => {
  it("maps Arabic yeh and kaf to the Persian letters", () => {
    expect(normalize("كتاب ي")).toBe("کتاب ی");
  });

  it("removes Arabic diacritics", () => {
    expect(normalize("س\u064Eلام")).toBe("سلام");
  });

  it("lowercases and trims", () => {
    expect(normalize("  ABC ")).toBe("abc");
  });
});

describe("matches", () => {
  const auction = makeAuction({
    title: "ساعت مچی کلاسیک",
    description: "بدنه استیل و مکانیزم اتوماتیک",
  });

  it("matches everything for an empty or blank query", () => {
    expect(matches(auction, "")).toBe(true);
    expect(matches(auction, "   ")).toBe(true);
  });

  it("finds a word in the title", () => {
    expect(matches(auction, "ساعت")).toBe(true);
  });

  it("finds a word in the description", () => {
    expect(matches(auction, "استیل")).toBe(true);
  });

  it("requires every word to be present", () => {
    expect(matches(auction, "ساعت استیل")).toBe(true);
    expect(matches(auction, "ساعت موتور")).toBe(false);
  });

  it("matches Arabic letter variants", () => {
    expect(matches(auction, "كلاسيك")).toBe(true);
  });
});
