import { Menu, Moon, Sun } from "lucide-react";
import SearchBox from "./SearchBox";
import NotificationBell from "./NotificationBell";

export default function Navbar({
  title,
  dark,
  onToggleTheme,
  onOpenMenu,
  user,
  notifications,
}) {
  return (
    <header className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 sm:px-6 sm:py-4">
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

      <div className="order-last w-full md:order-none md:w-auto md:max-w-md md:flex-1">
        <SearchBox />
      </div>

      <div className="flex items-center gap-2">
        {user && <NotificationBell n={notifications} />}
        <button
          onClick={onToggleTheme}
          className="rounded-lg border border-line p-2 transition-colors hover:bg-hover active:bg-primary-soft"
          aria-label="تغییر تم"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
