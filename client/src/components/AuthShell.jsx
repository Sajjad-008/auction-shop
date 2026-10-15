import { Link } from "react-router-dom";
import { Gavel, Moon, Sun } from "lucide-react";

export default function AuthShell({
  title,
  subtitle,
  dark,
  onToggleTheme,
  children,
  footer,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <button
        onClick={onToggleTheme}
        aria-label="تغییر تم"
        className="absolute left-4 top-4 rounded-lg border border-line bg-surface p-2 transition-colors hover:bg-hover active:bg-primary-soft"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-2xl font-bold text-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-btn text-white">
            <Gavel size={22} />
          </span>
          مزایده‌گاه
        </Link>

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>

        {children}

        <p className="text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
}
