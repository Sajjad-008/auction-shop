import { Link, NavLink } from "react-router-dom";
import {
  CircleDollarSign,
  Gavel,
  Heart,
  House,
  List,
  LogOut,
  X,
} from "lucide-react";
import { categories } from "../data/categories";

function Item({ to, end, icon: Icon, label, count, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors active:bg-primary-soft ${
          isActive
            ? "bg-primary-soft font-bold text-primary"
            : "text-fg hover:bg-hover"
        }`
      }
    >
      <Icon size={20} />
      <span className="flex-1 text-right">{label}</span>
      {count !== undefined && (
        <span className="rounded-full bg-bg px-2 text-xs text-muted">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ counts, user, onLogout, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-3 right-3 top-3 z-40 flex w-72 flex-col gap-1 overflow-y-auto rounded-2xl border border-line bg-surface p-4 transition-transform lg:sticky lg:bottom-auto lg:right-auto lg:top-4 lg:z-auto lg:h-[calc(100vh-2rem)] lg:shrink-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-btn text-white">
              <Gavel size={20} />
            </span>
            مزایده‌گاه
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-hover active:bg-primary-soft lg:hidden"
            aria-label="بستن منو"
          >
            <X size={22} />
          </button>
        </div>

        <p className="px-3 pt-2 text-xs font-bold text-muted">منو</p>
        <Item to="/" end icon={House} label="خانه" onClick={onClose} />
        <Item
          to="/active"
          icon={List}
          label="مزایده‌های فعال"
          count={counts.active}
          onClick={onClose}
        />
        <Item
          to="/my-bids"
          icon={CircleDollarSign}
          label="پیشنهادهای من"
          count={counts.myBids}
          onClick={onClose}
        />
        <Item
          to="/favorites"
          icon={Heart}
          label="علاقه‌مندی‌ها"
          count={counts.favorites}
          onClick={onClose}
        />

        <p className="px-3 pt-4 text-xs font-bold text-muted">دسته‌بندی‌ها</p>
        {categories.map((c) => (
          <Item
            key={c.key}
            to={`/category/${c.key}`}
            icon={c.icon}
            label={c.label}
            count={counts[c.key]}
            onClick={onClose}
          />
        ))}

        <div className="mt-auto pt-4">
          {user ? (
            <div className="flex items-center gap-3 rounded-xl bg-bg p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <p dir="ltr" className="truncate text-right text-xs text-muted">
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                aria-label="خروج"
                className="rounded-lg p-1.5 text-danger transition-colors hover:bg-hover active:bg-danger-soft"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={onClose}
                className="block rounded-xl bg-btn py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
              >
                ورود
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="block rounded-xl border border-line py-2.5 text-center text-sm font-medium transition-colors hover:bg-hover active:bg-primary-soft"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
