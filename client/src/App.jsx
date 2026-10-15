import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AuctionDetail from "./pages/AuctionDetail";
import MyBids from "./pages/MyBids";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import useTheme from "./hooks/useTheme";
import { initialAuctions } from "./data/auctions";
import { getMinNextBid, isEnded, formatToman, ME } from "./utils/auction";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) ?? null;
  } catch {
    return null;
  }
};

export default function App() {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [user, setUser] = useState(loadUser);
  const [dark, toggleTheme] = useTheme();

  const login = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const placeBid = (id, amount) => {
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
            {...themeProps}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/active" element={<Home />} />
        <Route path="/category/:key" element={<Home />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Route>
    </Routes>
  );
}
