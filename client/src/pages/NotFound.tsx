import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Gavel,
  House,
  LayoutDashboard,
  List,
  Moon,
  Sun,
} from "lucide-react";
import { animate, createScope } from "animejs";
import SearchBox from "../components/search/SearchBox";
import { panelPath } from "../utils/paths";
import type { User } from "../types";

interface Props {
  user: User | null;
  dark: boolean;
  onToggleTheme: () => void;
}

const MAX_PATH = 120;

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const primaryBtn =
  "flex items-center gap-2 rounded-xl bg-btn px-5 py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active";
const outlineBtn =
  "flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-medium transition-colors hover:bg-hover active:bg-primary-soft";

export default function NotFound({ user, dark, onToggleTheme }: Props) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);

  const requested = safeDecode(pathname + search).slice(0, MAX_PATH);
  const canGoBack = window.history.length > 1;

  useEffect(() => {
    const previous = document.title;
    document.title = "صفحه یافت نشد | اوج‌بها";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scope = createScope({ root: root.current }).add(() => {
      animate(".nf-gavel", {
        rotate: [-18, 12],
        duration: 650,
        ease: "inOutQuad",
        loop: true,
        alternate: true,
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center gap-7 p-6 text-center"
    >
      <button
        onClick={onToggleTheme}
        aria-label="تغییر تم"
        className="absolute left-4 top-4 rounded-lg border border-line bg-surface p-2 transition-colors hover:bg-hover active:bg-primary-soft"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold text-primary"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-btn text-white">
          <Gavel size={22} />
        </span>
        اوج‌بها
      </Link>

      <div
        dir="ltr"
        aria-hidden="true"
        className="flex items-center gap-3 text-8xl font-bold leading-none text-primary sm:text-9xl"
      >
        <span>۴</span>
        <span className="flex size-24 items-center justify-center rounded-full bg-primary-soft sm:size-32">
          <span
            className="nf-gavel inline-flex"
            style={{ transformOrigin: "80% 80%" }}
          >
            <Gavel className="size-12 sm:size-16" />
          </span>
        </span>
        <span>۴</span>
      </div>

      <div className="max-w-xl space-y-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          صفحه‌ی مورد نظر یافت نشد
        </h1>
        <p className="leading-8 text-muted">
          نشانی واردشده وجود ندارد یا ممکن است جابه‌جا شده باشد. لطفاً نشانی را
          بررسی کنید یا از گزینه‌های زیر ادامه دهید.
        </p>
        <p className="text-xs text-muted">نشانی درخواستی:</p>
        <code
          dir="ltr"
          className="mx-auto block max-w-full break-all rounded-lg bg-primary-soft px-3 py-1.5 text-sm text-primary"
        >
          {requested}
        </code>
      </div>

      <div className="w-full max-w-md space-y-2">
        <p className="text-sm text-muted">
          یا مزایده‌ی مورد نظر را جستجو کنید:
        </p>
        <SearchBox />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className={primaryBtn}>
          <House size={18} />
          بازگشت به صفحه‌ی اصلی
        </Link>
        <Link to="/auctions" className={outlineBtn}>
          <List size={18} />
          مشاهده‌ی مزایده‌ها
        </Link>
        {user && (
          <Link to={panelPath(user.role)} className={outlineBtn}>
            <LayoutDashboard size={18} />
            رفتن به پنل کاربری
          </Link>
        )}
        {canGoBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={outlineBtn}
          >
            <ArrowRight size={18} />
            بازگشت به صفحه‌ی قبل
          </button>
        )}
      </div>
    </div>
  );
}
