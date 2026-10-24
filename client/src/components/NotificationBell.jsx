import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import NotificationItem from "./NotificationItem";

export default function NotificationBell({ n }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const latest = n.items.slice(0, 5);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openItem = (item) => {
    n.markRead(item.id);
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  const badge =
    n.unread > 9
      ? `${(9).toLocaleString("fa-IR")}+`
      : n.unread.toLocaleString("fa-IR");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={
          n.unread ? `اعلان‌ها (${n.unread} خوانده‌نشده)` : "اعلان‌ها"
        }
        className="relative rounded-lg border border-line p-2 transition-colors hover:bg-hover active:bg-primary-soft"
      >
        <Bell size={20} />
        {n.unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">
            {badge}
          </span>
        )}
      </button>

      <div
        aria-hidden={!open}
        className={`absolute end-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-left rounded-2xl border border-line bg-surface p-2 shadow-lg transition-all duration-200 ease-out ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="font-bold">اعلان‌ها</span>
          <button
            type="button"
            onClick={n.markAllRead}
            disabled={n.unread === 0}
            tabIndex={open ? 0 : -1}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors enabled:hover:bg-hover enabled:active:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted"
          >
            <CheckCheck size={14} />
            خوانده‌شدن همه
          </button>
        </div>

        <div className="max-h-96 space-y-0.5 overflow-y-auto">
          {latest.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted">
              <BellOff size={28} />
              <p className="text-sm">اعلانی نداری.</p>
            </div>
          ) : (
            latest.map((item) => (
              <NotificationItem key={item.id} n={item} onOpen={openItem} />
            ))
          )}
        </div>

        <Link
          to="/notifications"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="mt-1 block rounded-xl py-2 text-center text-sm font-bold text-primary transition-colors hover:bg-hover active:bg-primary-soft"
        >
          مشاهده همه اعلان‌ها
        </Link>
      </div>
    </div>
  );
}
