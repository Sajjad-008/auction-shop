import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import SellerAuctionRow from "../../components/SellerAuctionRow";
import useAppContext from "../../hooks/useAppContext";
import { isEnded } from "../../utils/auction";
import type { BidResult } from "../../types";

const tabs = [
  { key: "all", label: "همه" },
  { key: "active", label: "در جریان" },
  { key: "ended", label: "پایان‌یافته" },
];

export default function SellerAuctions() {
  const { auctions, user, deleteAuction } = useAppContext();
  const [tab, setTab] = useState("all");
  const [message, setMessage] = useState<BidResult | null>(null);

  const mine = auctions
    .filter((a) => a.sellerEmail === user?.email)
    .sort((a, b) => b.id - a.id);

  const match = (key: string, ended: boolean) =>
    key === "all" || (key === "ended" ? ended : !ended);

  const list = mine.filter((a) => match(tab, isEnded(a)));

  const handleDelete = (id: number) => setMessage(deleteAuction(id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const count = mine.filter((a) => match(t.key, isEnded(a))).length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                  tab === t.key
                    ? "border-transparent bg-primary-soft font-bold text-primary"
                    : "border-line bg-surface hover:bg-hover active:bg-primary-soft"
                }`}
              >
                {t.label} ({count.toLocaleString("fa-IR")})
              </button>
            );
          })}
        </div>

        <Link
          to="/seller/new"
          className="flex items-center gap-2 rounded-xl bg-btn px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          <Plus size={18} />
          مزایده‌ی جدید
        </Link>
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.ok
              ? "bg-success-soft text-success"
              : "bg-danger-soft text-danger"
          }`}
        >
          {message.message}
        </p>
      )}

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
          <Package size={40} className="text-muted" />
          <p className="text-muted">
            {mine.length === 0
              ? "هنوز مزایده‌ای نساختی."
              : "مزایده‌ای در این بخش نیست."}
          </p>
          {mine.length === 0 && (
            <Link
              to="/seller/new"
              className="font-bold text-primary hover:underline"
            >
              ساخت اولین مزایده
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <SellerAuctionRow key={a.id} auction={a} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
