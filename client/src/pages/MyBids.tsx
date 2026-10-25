import { useState } from "react";
import { Link } from "react-router-dom";
import { CircleDollarSign } from "lucide-react";
import AuctionImage from "../components/AuctionImage";
import CountdownTimer from "../components/CountdownTimer";
import StatusBadge from "../components/StatusBadge";
import useAppContext from "../hooks/useAppContext";
import {
  getCurrentPrice,
  getMyStatus,
  getMyBestBid,
  formatToman,
} from "../utils/auction";
import type { MyStatus } from "../types";

const tabs = [
  { key: "all", label: "همه" },
  { key: "leading", label: "در صدر" },
  { key: "outbid", label: "پیشی گرفته شده" },
  { key: "won", label: "برنده شدم" },
];

const match = (tab: string, status: MyStatus) =>
  tab === "all" ||
  (tab === "outbid"
    ? status === "outbid" || status === "lost"
    : status === tab);

export default function MyBids() {
  const { auctions, user } = useAppContext();
  const [tab, setTab] = useState("all");

  if (!user)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
        <CircleDollarSign size={40} className="text-muted" />
        <p className="text-muted">برای دیدن پیشنهادهات اول وارد شو.</p>
        <Link
          to="/login"
          state={{ from: "/my-bids" }}
          className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </Link>
      </div>
    );

  const mine = auctions.flatMap((a) => {
    const status = getMyStatus(a);
    return status ? [{ a, status }] : [];
  });
  const list = mine.filter((x) => match(tab, x.status));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const count = mine.filter((x) => match(t.key, x.status)).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
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

      {list.length === 0 ? (
        <p className="py-10 text-center text-muted">
          پیشنهادی در این بخش نداری.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map(({ a, status }) => (
            <Link
              key={a.id}
              to={`/auction/${a.id}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 transition-colors hover:bg-hover"
            >
              <AuctionImage
                src={a.image}
                alt={a.title}
                className="h-20 w-20 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-bold">{a.title}</p>
                <p className="text-sm">
                  پیشنهاد من: {formatToman(getMyBestBid(a))}
                </p>
                <p className="text-sm text-muted">
                  قیمت فعلی: {formatToman(getCurrentPrice(a))}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={status} />
                <CountdownTimer endAt={a.endAt} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
