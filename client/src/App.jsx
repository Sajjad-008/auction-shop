import { useEffect, useState } from "react";
import AuctionCard from "./components/AuctionCard";
import { auctions } from "./data/auctions";

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={() => setDark(!dark)}
        className="mb-6 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium"
      >
        {dark ? "حالت روشن" : "حالت تاریک"}
      </button>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((a) => (
          <AuctionCard key={a.id} auction={a} />
        ))}
      </div>
    </div>
  );
}
