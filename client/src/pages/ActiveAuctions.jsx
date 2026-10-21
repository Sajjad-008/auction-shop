import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowUpDown, SearchX } from "lucide-react";
import AuctionCard from "../components/AuctionCard";
import Dropdown from "../components/Dropdown";
import { getCurrentPrice, isEnded } from "../utils/auction";

const HOUR = 60 * 60 * 1000;
const MILLION = 1_000_000;

const filters = [
  { key: "all", label: "همه", test: () => true },
  {
    key: "soon",
    label: "به‌زودی تموم می‌شه",
    hint: "کمتر از ۲ ساعت مانده",
    test: (a) => new Date(a.endAt) - Date.now() < 2 * HOUR,
  },
  {
    key: "hot",
    label: "رقابتی",
    hint: "دو پیشنهاد یا بیشتر",
    test: (a) => a.bids.length >= 2,
  },
];

const priceRanges = [
  { key: "all", label: "همه قیمت‌ها", test: () => true },
  {
    key: "low",
    label: "زیر ۱۰ میلیون",
    test: (a) => getCurrentPrice(a) < 10 * MILLION,
  },
  {
    key: "mid",
    label: "۱۰ تا ۳۰ میلیون",
    test: (a) =>
      getCurrentPrice(a) >= 10 * MILLION && getCurrentPrice(a) <= 30 * MILLION,
  },
  {
    key: "high",
    label: "بالای ۳۰ میلیون",
    test: (a) => getCurrentPrice(a) > 30 * MILLION,
  },
];

const sorts = [
  {
    key: "end",
    label: "نزدیک‌ترین زمان پایان",
    fn: (a, b) => new Date(a.endAt) - new Date(b.endAt),
  },
  {
    key: "priceAsc",
    label: "قیمت: کم به زیاد",
    fn: (a, b) => getCurrentPrice(a) - getCurrentPrice(b),
  },
  {
    key: "priceDesc",
    label: "قیمت: زیاد به کم",
    fn: (a, b) => getCurrentPrice(b) - getCurrentPrice(a),
  },
  {
    key: "bids",
    label: "بیشترین پیشنهاد",
    fn: (a, b) => b.bids.length - a.bids.length,
  },
];

export default function ActiveAuctions() {
  const { auctions } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("end");

  const active = auctions.filter((a) => !isEnded(a));
  const filterTest = filters.find((f) => f.key === filter).test;
  const priceTest = priceRanges.find((p) => p.key === price).test;
  const sortFn = sorts.find((s) => s.key === sort).fn;

  const list = active.filter((a) => filterTest(a) && priceTest(a)).sort(sortFn);
  const hasFilters = filter !== "all" || price !== "all";

  const reset = () => {
    setFilter("all");
    setPrice("all");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-muted">فیلتر:</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                title={f.hint}
                aria-pressed={filter === f.key}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === f.key
                    ? "border-transparent bg-primary-soft font-bold text-primary"
                    : "border-line bg-surface hover:bg-hover active:bg-primary-soft"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Dropdown
            value={price}
            onChange={setPrice}
            options={priceRanges}
            ariaLabel="بازه قیمت"
            pill
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpDown size={18} className="text-muted" />
            <span className="font-bold text-muted">مرتب‌سازی:</span>
            <Dropdown
              value={sort}
              onChange={setSort}
              options={sorts}
              ariaLabel="مرتب‌سازی"
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-muted">
            <span>
              نمایش {list.length.toLocaleString("fa-IR")} از{" "}
              {active.length.toLocaleString("fa-IR")} مزایده
            </span>
            {hasFilters && (
              <button
                onClick={reset}
                className="rounded-lg px-2 py-1 font-medium text-primary transition-colors hover:bg-hover active:bg-primary-soft"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
          <SearchX size={40} className="text-muted" />
          <p className="text-muted">مزایده‌ای با این فیلترها پیدا نشد.</p>
          <button
            onClick={reset}
            className="font-bold text-primary hover:underline"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((a) => (
            <AuctionCard key={a.id} auction={a} />
          ))}
        </div>
      )}
    </div>
  );
}
