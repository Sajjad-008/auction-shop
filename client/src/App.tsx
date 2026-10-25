import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ActiveAuctions from "./pages/ActiveAuctions";
import AuctionDetail from "./pages/AuctionDetail";
import MyBids from "./pages/MyBids";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import SearchResults from "./pages/SearchResults";
import Support from "./pages/Support";
import NewTicket from "./pages/NewTicket";
import TicketChat from "./pages/TicketChat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useTheme from "./hooks/useTheme";
import { initialAuctions } from "./data/auctions";
import { initialNotifications } from "./data/notifications";
import { autoReplies } from "./data/ticketCategories";
import { getMinNextBid, isEnded, formatToman, ME } from "./utils/auction";
import { faNum } from "./utils/ticket";
import type {
  AppNotification,
  Auction,
  BidResult,
  NewTicketInput,
  NotificationsApi,
  Ticket,
  TicketCategoryKey,
  TicketsApi,
  TicketStatus,
  User,
} from "./types";

type NewNotification = Pick<AppNotification, "type" | "title" | "text"> & {
  link?: string | null;
};

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`ذخیره‌ی «${key}» ممکن نشد (حافظه‌ی مرورگر پر است).`);
  }
};

const msgId = () => `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`;

export default function App() {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [user, setUser] = useState<User | null>(() =>
    load<User | null>("user", null),
  );
  const [favorites, setFavorites] = useState<number[]>(() =>
    load<number[]>("favorites", []),
  );
  const [items, setItems] = useState<AppNotification[]>(() =>
    load<AppNotification[]>("notifications", initialNotifications),
  );
  const [ticketItems, setTicketItems] = useState<Ticket[]>(() =>
    load<Ticket[]>("tickets", []),
  );
  const [dark, toggleTheme] = useTheme();

  useEffect(() => save("favorites", favorites), [favorites]);
  useEffect(() => save("notifications", items), [items]);
  useEffect(() => save("tickets", ticketItems), [ticketItems]);

  const addNotification = (n: NewNotification) =>
    setItems((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        read: false,
        link: null,
        ...n,
      },
      ...prev,
    ]);

  const notifications: NotificationsApi = {
    items,
    unread: items.filter((x) => !x.read).length,
    markRead: (id) =>
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, read: true } : x)),
      ),
    markAllRead: () =>
      setItems((prev) => prev.map((x) => ({ ...x, read: true }))),
    remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
  };

  // پاسخ پشتیبانی شبیه‌سازی‌شده؛ با بک‌اند، جواب واقعی از طرف ادمین می‌آید
  const scheduleReply = (
    number: number,
    category: TicketCategoryKey | null,
  ) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const first = category !== null;
      const text = category
        ? autoReplies[category]
        : "پیامت رو دریافت کردیم و بررسی می‌کنیم.";
      setTicketItems((prev) =>
        prev.map(
          (t): Ticket =>
            t.number === number && t.status !== "closed"
              ? {
                  ...t,
                  status: first ? "answered" : t.status,
                  updatedAt: now,
                  messages: [
                    ...t.messages,
                    {
                      id: msgId(),
                      from: "support",
                      auto: true,
                      text,
                      images: [],
                      at: now,
                    },
                  ],
                }
              : t,
        ),
      );
      addNotification({
        type: "support",
        title: "پاسخ پشتیبانی",
        text: `برای تیکت #${faNum(number)} پیام جدید داری.`,
        link: `/support/${number}`,
      });
    }, 1500);
  };

  const tickets: TicketsApi = {
    items: ticketItems,
    create: ({ category, title, message, images }: NewTicketInput) => {
      const number =
        ticketItems.reduce((m, t) => Math.max(m, t.number), 1000) + 1;
      const now = new Date().toISOString();
      const ticket: Ticket = {
        number,
        userEmail: user?.email ?? "",
        category,
        title,
        status: "open",
        createdAt: now,
        updatedAt: now,
        messages: [
          { id: msgId(), from: "user", text: message, images, at: now },
        ],
      };
      setTicketItems((prev) => [ticket, ...prev]);
      scheduleReply(number, category);
      return number;
    },
    addMessage: (number, { text, images }) => {
      const now = new Date().toISOString();
      setTicketItems((prev) =>
        prev.map(
          (t): Ticket =>
            t.number === number
              ? {
                  ...t,
                  status: "open",
                  updatedAt: now,
                  messages: [
                    ...t.messages,
                    { id: msgId(), from: "user", text, images, at: now },
                  ],
                }
              : t,
        ),
      );
      scheduleReply(number, null);
    },
    setStatus: (number: number, status: TicketStatus) =>
      setTicketItems((prev) =>
        prev.map((t) =>
          t.number === number
            ? { ...t, status, updatedAt: new Date().toISOString() }
            : t,
        ),
      ),
  };

  const login = (u: User) => {
    setUser(u);
    save("user", u);
    addNotification({
      type: "system",
      title: "ورود به حساب",
      text: `با ایمیل ${u.email} وارد حسابت شدی.`,
    });
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleFavorite = (id: number) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const placeBid = (id: number, amount: number): BidResult => {
    if (!user) return { ok: false, message: "برای ثبت پیشنهاد اول وارد شو." };
    const a = auctions.find((x) => x.id === id);
    if (!a) return { ok: false, message: "مزایده پیدا نشد." };
    if (isEnded(a))
      return { ok: false, message: "این مزایده پایان یافته است." };
    if (a.bids[0]?.user === ME)
      return {
        ok: false,
        message: "آخرین پیشنهاد مال خودته. منتظر پیشنهاد بعدی بمون.",
      };
    const min = getMinNextBid(a);
    if (amount < min)
      return { ok: false, message: `حداقل پیشنهاد ${formatToman(min)} است.` };

    setAuctions((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              bids: [
                { user: ME, amount, at: new Date().toISOString() },
                ...x.bids,
              ],
            }
          : x,
      ),
    );
    addNotification({
      type: "bid",
      title: "پیشنهادت ثبت شد",
      text: `پیشنهاد ${formatToman(amount)} برای «${a.title}» ثبت شد.`,
      link: `/auction/${id}`,
    });
    return { ok: true, message: "پیشنهادت ثبت شد." };
  };

  const themeProps = { dark, onToggleTheme: toggleTheme };

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login user={user} onAuth={login} {...themeProps} />}
      />
      <Route
        path="/signup"
        element={<Signup user={user} onAuth={login} {...themeProps} />}
      />

      <Route
        element={
          <Layout
            auctions={auctions}
            placeBid={placeBid}
            user={user}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            notifications={notifications}
            tickets={tickets}
            onLogout={logout}
            {...themeProps}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/active" element={<ActiveAuctions />} />
        <Route path="/category/:key" element={<Home />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/new" element={<NewTicket />} />
        <Route path="/support/:number" element={<TicketChat />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Route>
    </Routes>
  );
}
