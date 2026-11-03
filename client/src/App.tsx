import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RoleGuard from "./components/RoleGuard";
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
import Landing from "./pages/Landing";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerAuctions from "./pages/seller/SellerAuctions";
import NewAuction from "./pages/seller/NewAuction";
import useTheme from "./hooks/useTheme";
import { initialAuctions } from "./data/auctions";
import { initialNotifications } from "./data/notifications";
import { autoReplies } from "./data/ticketCategories";
import { getMinNextBid, isEnded, formatToman, ME } from "./utils/auction";
import { faNum } from "./utils/ticket";
import type {
  Account,
  AppNotification,
  Auction,
  BidResult,
  NewAuctionInput,
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
const emailKey = (email: string) => email.trim().toLowerCase();

const loadUser = (): User | null => {
  const u = load<User | null>("user", null);
  return u ? { ...u, role: u.role ?? "buyer" } : null;
};

export default function App() {
  const [auctions, setAuctions] = useState<Auction[]>(() => [
    ...load<Auction[]>("userAuctions", []),
    ...initialAuctions,
  ]);
  const [user, setUser] = useState<User | null>(loadUser);
  const [accounts, setAccounts] = useState<Record<string, Account>>(() =>
    load<Record<string, Account>>("accounts", {}),
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
  useEffect(() => save("accounts", accounts), [accounts]);
  useEffect(
    () =>
      save(
        "userAuctions",
        auctions.filter((a) => a.sellerEmail),
      ),
    [auctions],
  );

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

  const startSession = (u: User) => {
    setUser(u);
    save("user", u);
    addNotification({
      type: "system",
      title: "ورود به حساب",
      text: `با ایمیل ${u.email} وارد حسابت شدی.`,
    });
  };

  const login = (u: User) => {
    const known = accounts[emailKey(u.email)];
    startSession(known ? { ...u, name: known.name, role: known.role } : u);
  };

  const register = (u: User) => {
    setAccounts((prev) => ({
      ...prev,
      [emailKey(u.email)]: { name: u.name, role: u.role },
    }));
    startSession(u);
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
    if (user.role === "seller")
      return {
        ok: false,
        message: "حساب فروشنده نمی‌تونه پیشنهاد بده. با حساب خریدار وارد شو.",
      };
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

  const createAuction = (input: NewAuctionInput): number => {
    const id = auctions.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    const auction: Auction = {
      id,
      category: input.category,
      title: input.title,
      image: input.image,
      description: input.description,
      startPrice: input.startPrice,
      bidStep: input.bidStep,
      endAt: new Date(
        Date.now() + input.durationMinutes * 60 * 1000,
      ).toISOString(),
      bids: [],
      sellerEmail: user?.email,
    };
    setAuctions((prev) => [auction, ...prev]);
    addNotification({
      type: "system",
      title: "مزایده منتشر شد",
      text: `مزایده‌ی «${input.title}» منتشر شد.`,
      link: `/auction/${id}`,
    });
    return id;
  };

  const deleteAuction = (id: number): BidResult => {
    const a = auctions.find((x) => x.id === id);
    if (!a || a.sellerEmail !== user?.email)
      return { ok: false, message: "فقط صاحب مزایده می‌تونه اون رو حذف کنه." };
    if (a.bids.length > 0)
      return { ok: false, message: "مزایده‌ای که پیشنهاد دارد قابل حذف نیست." };
    setAuctions((prev) => prev.filter((x) => x.id !== id));
    return { ok: true, message: `مزایده‌ی «${a.title}» حذف شد.` };
  };

  const themeProps = { dark, onToggleTheme: toggleTheme };

  return (
    <Routes>
      <Route
        path="/"
        element={<Landing auctions={auctions} user={user} {...themeProps} />}
      />
      <Route
        path="/login"
        element={<Login user={user} onAuth={login} {...themeProps} />}
      />
      <Route
        path="/signup"
        element={<Signup user={user} onRegister={register} {...themeProps} />}
      />

      <Route
        element={
          <Layout
            auctions={auctions}
            placeBid={placeBid}
            createAuction={createAuction}
            deleteAuction={deleteAuction}
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
        <Route path="/auctions" element={<Home />} />
        <Route path="/active" element={<ActiveAuctions />} />
        <Route path="/category/:key" element={<Home />} />
        <Route
          path="/my-bids"
          element={
            <RoleGuard role="buyer" guestOk>
              <MyBids />
            </RoleGuard>
          }
        />
        <Route
          path="/favorites"
          element={
            <RoleGuard role="buyer" guestOk>
              <Favorites />
            </RoleGuard>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/new" element={<NewTicket />} />
        <Route path="/support/:number" element={<TicketChat />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />

        <Route
          path="/seller"
          element={
            <RoleGuard role="seller">
              <SellerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/seller/auctions"
          element={
            <RoleGuard role="seller">
              <SellerAuctions />
            </RoleGuard>
          }
        />
        <Route
          path="/seller/new"
          element={
            <RoleGuard role="seller">
              <NewAuction />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}
