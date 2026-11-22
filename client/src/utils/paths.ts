import type { Role } from "../types";

export const panelPath = (role: Role): string => {
  if (role === "seller") return "/seller";
  if (role === "admin") return "/admin";
  return "/auctions";
};

export const roleLabels: Record<Role, string> = {
  buyer: "خریدار",
  seller: "فروشنده",
  admin: "مدیر سامانه",
};
