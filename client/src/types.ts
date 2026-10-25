export type CategoryKey =
  | "electronics"
  | "collectibles"
  | "decor"
  | "art"
  | "cars";

export interface Bid {
  user: string;
  amount: number;
  at: string;
}

export interface Auction {
  id: number;
  category: CategoryKey;
  title: string;
  image: string;
  description: string;
  startPrice: number;
  bidStep: number;
  endAt: string;
  bids: Bid[];
}

export interface User {
  name: string;
  email: string;
}

export type MyStatus = "leading" | "outbid" | "won" | "lost";

export interface BidResult {
  ok: boolean;
  message: string;
}

export type NotificationType =
  | "bid"
  | "outbid"
  | "ending"
  | "won"
  | "support"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  text: string;
  at: string;
  read: boolean;
  link: string | null;
}

export interface NotificationsApi {
  items: AppNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
}

export type TicketStatus = "open" | "answered" | "closed";
export type TicketCategoryKey = "technical" | "auction" | "account" | "other";

export interface TicketMessage {
  id: string;
  from: "user" | "support";
  auto?: boolean;
  text: string;
  images: string[];
  at: string;
}

export interface Ticket {
  number: number;
  userEmail: string;
  category: TicketCategoryKey;
  title: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface NewTicketInput {
  category: TicketCategoryKey;
  title: string;
  message: string;
  images: string[];
}

export interface TicketsApi {
  items: Ticket[];
  create: (input: NewTicketInput) => number;
  addMessage: (
    number: number,
    message: { text: string; images: string[] },
  ) => void;
  setStatus: (number: number, status: TicketStatus) => void;
}

// چیزی که Layout از طریق Outlet به صفحه‌ها می‌دهد
export interface AppContext {
  auctions: Auction[];
  placeBid: (id: number, amount: number) => BidResult;
  user: User | null;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  notifications: NotificationsApi;
  tickets: TicketsApi;
}

export interface Option<K extends string = string> {
  key: K;
  label: string;
}
