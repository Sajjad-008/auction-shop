import { describe, expect, it } from "vitest";
import { panelPath, roleLabels } from "./paths";
import type { Role } from "../types";

describe("panelPath", () => {
  it("sends a buyer to the auction list", () => {
    expect(panelPath("buyer")).toBe("/auctions");
  });

  it("sends a seller to the seller panel", () => {
    expect(panelPath("seller")).toBe("/seller");
  });

  it("sends an administrator to the admin panel", () => {
    expect(panelPath("admin")).toBe("/admin");
  });
});

describe("roleLabels", () => {
  it("has a non-empty label for every role", () => {
    const roles: Role[] = ["buyer", "seller", "admin"];
    for (const role of roles) expect(roleLabels[role]).toBeTruthy();
  });
});
