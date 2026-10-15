import { Gavel, House, List, X } from "lucide-react";
import { categories } from "../data/categories";

function Item({ icon: Icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors active:bg-primary-soft ${
        active
          ? "bg-primary-soft font-bold text-primary"
          : "text-fg hover:bg-hover"
      }`}
    >
      <Icon size={20} />
      <span className="flex-1 text-right">{label}</span>
      {count !== undefined && (
        <span className="rounded-full bg-bg px-2 text-xs text-muted">
          {count.toLocaleString("fa-IR")}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ section, onSelect, counts, open, onClose }) {
  const pick = (key) => {
    onSelect(key);
    onClose();
  };

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
        <Item
          icon={House}
          label="خانه"
          active={section === "home"}
          onClick={() => pick("home")}
        />
        <Item
          icon={List}
          label="مزایده‌های فعال"
          count={counts.active}
          active={section === "active"}
          onClick={() => pick("active")}
        />

        <p className="px-3 pt-4 text-xs font-bold text-muted">دسته‌بندی‌ها</p>
        {categories.map((c) => (
          <Item
            key={c.key}
            icon={c.icon}
            label={c.label}
            count={counts[c.key]}
            active={section === c.key}
            onClick={() => pick(c.key)}
          />
        ))}
      </aside>
    </>
  );
}
