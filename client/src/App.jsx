import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AuctionCard from "./components/AuctionCard";
import { auctions } from "./data/auctions";
import { categories } from "./data/categories";

const isActive = (a) => new Date(a.endAt) > Date.now();

export default function App() {
  const [section, setSection] = useState("home");
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

  const counts = { active: auctions.filter(isActive).length };
  categories.forEach((c) => {
    counts[c.key] = auctions.filter((a) => a.category === c.key).length;
  });

  let list = auctions;
  if (section === "active") list = auctions.filter(isActive);
  else if (section !== "home")
    list = auctions.filter((a) => a.category === section);

  const titles = {
    home: "همه مزایده‌ها",
    active: "مزایده‌های فعال",
    ...Object.fromEntries(categories.map((c) => [c.key, c.label])),
  };

  return (
    <div className="flex min-h-screen gap-4 p-4">
      <Sidebar
        section={section}
        onSelect={setSection}
        counts={counts}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Navbar
          title={titles[section]}
          dark={dark}
          onToggleTheme={() => setDark(!dark)}
          onOpenMenu={() => setMenuOpen(true)}
        />

        <main>
          {list.length === 0 ? (
            <p className="text-muted">مزایده‌ای در این بخش نیست.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((a) => (
                <AuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
