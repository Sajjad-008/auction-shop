import { describe, expect, it } from "vitest";
import {
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
  validateRequired,
} from "./validation";

describe("validateName", () => {
  it("rejects empty and whitespace-only names", () => {
    expect(validateName("")).not.toBe("");
    expect(validateName("   ")).not.toBe("");
  });

  it("rejects a name shorter than three characters", () => {
    expect(validateName("ab")).not.toBe("");
  });

  it("accepts a normal name", () => {
    expect(validateName("علی رضایی")).toBe("");
  });
});

describe("validateEmail", () => {
  it("rejects an empty value", () => {
    expect(validateEmail("")).not.toBe("");
  });

  it("rejects values without the e-mail shape", () => {
    expect(validateEmail("abc")).not.toBe("");
    expect(validateEmail("a b@c.d")).not.toBe("");
  });

  it("accepts a valid e-mail", () => {
    expect(validateEmail("user@example.com")).toBe("");
  });
});

describe("validatePassword", () => {
  it("rejects empty and short passwords", () => {
    expect(validatePassword("")).not.toBe("");
    expect(validatePassword("1234567")).not.toBe("");
  });

  it("accepts eight characters", () => {
    expect(validatePassword("12345678")).toBe("");
  });
});

describe("validateConfirm", () => {
  it("rejects an empty confirmation", () => {
    expect(validateConfirm("12345678", "")).not.toBe("");
  });

  it("rejects a different value", () => {
    expect(validateConfirm("12345678", "1234567")).not.toBe("");
  });

  it("accepts the same value", () => {
    expect(validateConfirm("12345678", "12345678")).toBe("");
  });
});

describe("validateRequired", () => {
  it("rejects empty and accepts non-empty values", () => {
    expect(validateRequired("")).not.toBe("");
    expect(validateRequired("x")).toBe("");
  });
});
