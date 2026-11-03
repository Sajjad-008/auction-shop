import type { Role } from "../types";

export const panelPath = (role: Role): string =>
  role === "seller" ? "/seller" : "/auctions";
