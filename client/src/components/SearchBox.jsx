import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Dropdown from "./Dropdown";
import { categories } from "../data/categories";

const options = [
  { key: "all", label: "همه دسته‌ها" },
  ...categories.map((c) => ({ key: c.key, label: c.label })),
];

export default function SearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(() =>
    pathname === "/search" ? (params.get("q") ?? "") : "",
  );
  const [cat, setCat] = useState(() =>
    pathname === "/search" ? (params.get("cat") ?? "all") : "all",
  );

  // وقتی روی صفحه‌ی نتایج هستیم و آدرس عوض می‌شه، فیلدها همگام بمونن
  useEffect(() => {
    if (pathname === "/search") {
      setQ(params.get("q") ?? "");
      setCat(params.get("cat") ?? "all");
    }
  }, [pathname, params]);

  const submit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (cat !== "all") next.set("cat", cat);
    navigate(`/search?${next.toString()}`);
  };

  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex w-full items-center rounded-xl border border-line bg-bg transition-colors focus-within:border-primary"
    >
      <Dropdown
        bare
        value={cat}
        onChange={setCat}
        options={options}
        ariaLabel="دسته‌بندی جستجو"
      />
      <span className="h-6 w-px shrink-0 bg-line" aria-hidden="true" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجوی مزایده..."
        aria-label="عبارت جستجو"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
      />
      <button
        type="submit"
        aria-label="جستجو"
        className="m-1 rounded-lg p-2 text-muted transition-colors hover:bg-hover active:bg-primary-soft"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
