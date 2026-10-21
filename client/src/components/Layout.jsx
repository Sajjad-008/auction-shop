import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { categories } from "../data/categories";
import { getMyStatus, isEnded } from "../utils/auction";

export default function Layout({
  auctions,
  placeBid,
  user,
  onLogout,
  favorites,
  toggleFavorite,
  dark,
  onToggleTheme,
}) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const counts = {
    active: auctions.filter((a) => !isEnded(a)).length,
    myBids: user ? auctions.filter((a) => getMyStatus(a)).length : 0,
    favorites: user
      ? auctions.filter((a) => favorites.includes(a.id)).length
      : 0,
  };
  categories.forEach((c) => {
    counts[c.key] = auctions.filter((a) => a.category === c.key).length;
  });

  let title = "همه مزایده‌ها";
  if (pathname === "/active") title = "مزایده‌های فعال";
  else if (pathname === "/my-bids") title = "پیشنهادهای من";
  else if (pathname === "/favorites") title = "علاقه‌مندی‌ها";
  else if (pathname === "/search") title = "نتایج جستجو";
  else if (pathname.startsWith("/category/"))
    title =
      categories.find((c) => c.key === pathname.split("/")[2])?.label ??
      "دسته‌بندی";
  else if (pathname.startsWith("/auction/")) title = "جزئیات مزایده";

  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar
        counts={counts}
        user={user}
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Navbar
          title={title}
          dark={dark}
          onToggleTheme={onToggleTheme}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main>
          <Outlet
            context={{ auctions, placeBid, user, favorites, toggleFavorite }}
          />
        </main>
      </div>
    </div>
  );
}
