import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import NotificationItem from "../components/NotificationItem";

const tabs = [
  { key: "all", label: "همه" },
  { key: "unread", label: "خوانده‌نشده" },
];

export default function Notifications() {
  const { user, notifications: n } = useOutletContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");

  if (!user)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
        <Bell size={40} className="text-muted" />
        <p className="text-muted">برای دیدن اعلان‌هات اول وارد شو.</p>
        <Link
          to="/login"
          state={{ from: "/notifications" }}
          className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </Link>
      </div>
    );

  const list = tab === "unread" ? n.items.filter((x) => !x.read) : n.items;

  const open = (item) => {
    n.markRead(item.id);
    if (item.link) navigate(item.link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {tabs.map((t) => {
            const count = t.key === "unread" ? n.unread : n.items.length;
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

        <button
          onClick={n.markAllRead}
          disabled={n.unread === 0}
          className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors enabled:hover:bg-hover enabled:active:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted"
        >
          <CheckCheck size={16} />
          علامت‌گذاری همه به‌عنوان خوانده‌شده
        </button>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
          <BellOff size={40} className="text-muted" />
          <p className="text-muted">
            {tab === "unread" ? "همه‌ی اعلان‌ها رو خوندی." : "اعلانی نداری."}
          </p>
        </div>
      ) : (
        <div className="space-y-1 rounded-2xl border border-line bg-surface p-2">
          {list.map((item) => (
            <NotificationItem
              key={item.id}
              n={item}
              onOpen={open}
              onRemove={n.remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
