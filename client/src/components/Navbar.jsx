import { Menu, Moon, Sun } from "lucide-react";

export default function Navbar({ title, dark, onToggleTheme, onOpenMenu }) {
  return (
    <header className="sticky top-4 z-20 flex items-center justify-between rounded-2xl border border-line bg-surface px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="rounded-lg p-1.5 transition-colors hover:bg-hover active:bg-primary-soft lg:hidden"
          aria-label="باز کردن منو"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <button
        onClick={onToggleTheme}
        className="rounded-lg border border-line p-2 transition-colors hover:bg-hover active:bg-primary-soft"
        aria-label="تغییر تم"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
