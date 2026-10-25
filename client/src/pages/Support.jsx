import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { LifeBuoy, Plus } from "lucide-react";
import TicketStatusBadge from "../components/TicketStatusBadge";
import { ticketCategories } from "../data/ticketCategories";
import { timeAgo } from "../utils/auction";
import { faNum } from "../utils/ticket";

const tabs = [
  { key: "all", label: "همه" },
  { key: "open", label: "در انتظار پاسخ" },
  { key: "answered", label: "پاسخ داده شده" },
  { key: "closed", label: "بسته شده" },
];

export default function Support() {
  const { user, tickets } = useOutletContext();
  const [tab, setTab] = useState("all");

  if (!user)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
        <LifeBuoy size={40} className="text-muted" />
        <p className="text-muted">برای ثبت یا دیدن تیکت‌ها اول وارد شو.</p>
        <Link
          to="/login"
          state={{ from: "/support" }}
          className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </Link>
      </div>
    );

  const mine = tickets.items
    .filter((t) => t.userEmail === user.email)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const list = tab === "all" ? mine : mine.filter((t) => t.status === tab);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const count =
              t.key === "all"
                ? mine.length
                : mine.filter((x) => x.status === t.key).length;
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
          to="/support/new"
          className="flex items-center gap-2 rounded-xl bg-btn px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          <Plus size={18} />
          تیکت جدید
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
          <LifeBuoy size={40} className="text-muted" />
          <p className="text-muted">
            {mine.length === 0
              ? "هنوز تیکتی ثبت نکردی."
              : "تیکتی در این بخش نیست."}
          </p>
          {mine.length === 0 && (
            <Link
              to="/support/new"
              className="font-bold text-primary hover:underline"
            >
              ثبت اولین تیکت
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((t) => {
            const cat = ticketCategories.find((c) => c.key === t.category);
            return (
              <Link
                key={t.number}
                to={`/support/${t.number}`}
                className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-hover"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-bold">{t.title}</p>
                  <p className="text-sm text-muted">
                    #{faNum(t.number)} • {cat?.label} • {timeAgo(t.updatedAt)}
                  </p>
                </div>
                <TicketStatusBadge status={t.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
