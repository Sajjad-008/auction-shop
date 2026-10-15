import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { categories } from "../data/categories";
import { isEnded } from "../utils/auction";

export default function Layout({ auctions, placeBid }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const counts = { active: auctions.filter((a) => !isEnded(a)).length };
  categories.forEach((c) => {
    counts[c.key] = auctions.filter((a) => a.category === c.key).length;
  });

  let title = "همه مزایده‌ها";
  if (pathname === "/active") title = "مزایده‌های فعال";
  else if (pathname.startsWith("/category/"))
    title =
      categories.find((c) => c.key === pathname.split("/")[2])?.label ??
      "دسته‌بندی";
  else if (pathname.startsWith("/auction/")) title = "جزئیات مزایده";

  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar
        counts={counts}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Navbar
          title={title}
          dark={dark}
          onToggleTheme={() => setDark(!dark)}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main>
          <Outlet context={{ auctions, placeBid }} />
        </main>
      </div>
    </div>
  );
}
