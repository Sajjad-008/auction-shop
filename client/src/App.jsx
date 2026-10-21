import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AuctionDetail from "./pages/AuctionDetail";
import MyBids from "./pages/MyBids";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useTheme from "./hooks/useTheme";
import { initialAuctions } from "./data/auctions";
import { getMinNextBid, isEnded, formatToman, ME } from "./utils/auction";
import ActiveAuctions from "./pages/ActiveAuctions";
import SearchResults from "./pages/SearchResults";

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [user, setUser] = useState(() => load("user", null));
  const [favorites, setFavorites] = useState(() => load("favorites", []));
  const [dark, toggleTheme] = useTheme();

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const login = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const placeBid = (id, amount) => {
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
            onLogout={logout}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            {...themeProps}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/active" element={<ActiveAuctions />} />
        <Route path="/category/:key" element={<Home />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Route>
    </Routes>
  );
}
