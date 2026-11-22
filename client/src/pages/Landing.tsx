import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Gavel,
  Handshake,
  History,
  LayoutDashboard,
  LifeBuoy,
  Moon,
  ShieldCheck,
  Store,
  Sun,
  Timer,
  Trophy,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "../components/ui/AnimatedNumber";
import AuctionImage from "../components/auction/AuctionImage";
import CountdownTimer from "../components/auction/CountdownTimer";
import Faq from "../components/landing/Faq";
import GithubIcon from "../components/ui/GithubIcon";
import { categories } from "../data/categories";
import { partners } from "../data/partners";
import { formatToman, getCurrentPrice, isEnded } from "../utils/auction";
import { panelPath } from "../utils/paths";
import type { Auction, User } from "../types";
import HeroAnimation from "../components/landing/HeroAnimation";

interface Props {
  auctions: Auction[];
  user: User | null;
  dark: boolean;
  onToggleTheme: () => void;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

const steps: Feature[] = [
  {
    icon: UserPlus,
    title: "ثبت‌نام کنید",
    text: "با ایمیل خود در چند ثانیه حساب کاربری بسازید. مشاهده‌ی مزایده‌ها بدون ثبت‌نام نیز آزاد است.",
  },
  {
    icon: CircleDollarSign,
    title: "پیشنهاد دهید",
    text: "مزایده‌ی مورد نظر خود را انتخاب کنید و پیشنهادی بالاتر از قیمت فعلی ثبت کنید.",
  },
  {
    icon: Trophy,
    title: "برنده شوید",
    text: "اگر تا پایان زمان مزایده بالاترین پیشنهاد از آنِ شما باشد، برنده‌ی مزایده خواهید بود و اعلان آن را دریافت می‌کنید.",
  },
];

const reasons: Feature[] = [
  {
    icon: Timer,
    title: "تایمر زنده",
    text: "زمان باقی‌مانده در هر لحظه نمایش داده می‌شود و در ۵ دقیقه‌ی پایانی به رنگ قرمز درمی‌آید.",
  },
  {
    icon: History,
    title: "تاریخچه‌ی شفاف",
    text: "تمامی پیشنهادهای هر مزایده با مبلغ و زمان ثبت قابل مشاهده است.",
  },
  {
    icon: ShieldCheck,
    title: "قوانین مشخص",
    text: "حداقل گام پیشنهاد مشخص است و پیش از ثبت هر پیشنهاد، تأیید شما دریافت می‌شود.",
  },
  {
    icon: LifeBuoy,
    title: "پشتیبانی تیکتی",
    text: "هر پرسش یا مشکل را همراه با دسته‌بندی و تصویر برای پشتیبانی ارسال کنید.",
  },
];

const sellerPoints = [
  "قیمت پایه و گام پیشنهاد را خودتان تعیین می‌کنید.",
  "تاریخچه‌ی پیشنهادها تا پایان مزایده شفاف باقی می‌ماند.",
  "با اعلان‌ها و تیکت‌ها از همه‌چیز مطلع می‌شوید.",
];

function SectionHead({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-8 space-y-2 text-center">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {text && <p className="mx-auto max-w-2xl text-muted">{text}</p>}
    </div>
  );
}

export default function Landing({
  auctions,
  user,
  dark,
  onToggleTheme,
}: Props) {
  const active = auctions.filter((a) => !isEnded(a));
  const featured = [...active].sort(
    (a, b) => new Date(a.endAt).getTime() - new Date(b.endAt).getTime(),
  )[0];

  const stats = [
    { value: active.length, label: "مزایده‌ی فعال" },
    { value: auctions.length, label: "مزایده‌ی ثبت‌شده" },
    {
      value: auctions.reduce((sum, a) => sum + a.bids.length, 0),
      label: "پیشنهاد ثبت‌شده",
    },
    { value: categories.length, label: "دسته‌بندی" },
  ];

  const primaryBtn =
    "rounded-xl bg-btn px-6 py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active";
  const outlineBtn =
    "rounded-xl border border-line bg-surface px-6 py-3 font-medium transition-colors hover:bg-hover active:bg-primary-soft";

  const dashboard = user ? panelPath(user.role) : "/login";
  const showSellerCta = !user || user.role === "seller";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-btn text-white">
              <Gavel size={20} />
            </span>
            اوج‌بها
          </Link>

          <nav
            aria-label="بخش‌های صفحه"
            className="hidden items-center gap-6 text-sm md:flex"
          >
            <a
              href="#how"
              className="text-muted transition-colors hover:text-fg"
            >
              چگونه کار می‌کند؟
            </a>
            <a
              href="#why"
              className="text-muted transition-colors hover:text-fg"
            >
              چرا مزایده‌گاه؟
            </a>
            <a
              href="#sell"
              className="text-muted transition-colors hover:text-fg"
            >
              فروشنده‌ها
            </a>
            <a
              href="#faq"
              className="text-muted transition-colors hover:text-fg"
            >
              سؤالات متداول
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              aria-label="تغییر تم"
              className="rounded-lg border border-line p-2 transition-colors hover:bg-hover active:bg-primary-soft"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <Link
                to={dashboard}
                className="flex items-center gap-2 rounded-xl bg-btn px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active sm:px-4"
              >
                <LayoutDashboard size={18} />
                داشبورد
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-line px-3 py-2 text-sm font-medium transition-colors hover:bg-hover active:bg-primary-soft sm:px-4"
                >
                  ورود
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-btn px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active sm:px-4"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1 text-sm font-medium text-primary">
              <HeroAnimation />
              مزایده‌ی آنلاین
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              پیشنهاد بده، <span className="text-primary">برنده شوید</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted">
              تایمر زنده، قیمت‌های شفاف و تاریخچه‌ی کامل پیشنهادها. توی اوج‌بها
              همه‌چیز جلوی چشم توئه.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/auctions"
                className={`flex items-center gap-2 ${primaryBtn}`}
              >
                مشاهده‌ی مزایده‌ها
                <ArrowLeft size={18} />
              </Link>
              <a href="#how" className={outlineBtn}>
                چگونه کار می‌کند؟
              </a>
            </div>
            {!user && (
              <p className="text-sm text-muted">
                مشاهده‌ی مزایده‌ها نیازی به ثبت‌نام ندارد.
              </p>
            )}
          </div>

          {featured && (
            <Link
              to={`/auction/${featured.id}`}
              className="block overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:bg-hover"
            >
              <AuctionImage
                src={featured.image}
                alt={featured.title}
                className="h-56 w-full sm:h-72"
              />
              <div className="space-y-3 p-5">
                <p className="text-xs font-bold text-danger">
                  نزدیک‌ترین مزایده به پایان
                </p>
                <h2 className="text-lg font-bold">{featured.title}</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted">قیمت فعلی</p>
                    <p className="text-xl font-bold text-primary">
                      {formatToman(getCurrentPrice(featured))}
                    </p>
                  </div>
                  <CountdownTimer endAt={featured.endAt} />
                </div>
              </div>
            </Link>
          )}
        </section>

        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
          <SectionHead
            title="چگونه کار می‌کند؟"
            text="تنها سه گام تا برنده شدن."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="space-y-3 rounded-2xl border border-line bg-surface p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-bold text-primary">
                    {(i + 1).toLocaleString("fa-IR")}
                  </span>
                  <s.icon size={22} className="text-muted" />
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="leading-7 text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="stats"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12"
        >
          <div className="rounded-3xl border border-line bg-surface px-6 py-10">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="space-y-1">
                  <p className="text-4xl font-bold text-primary">
                    <AnimatedNumber value={s.value} />
                  </p>
                  <p className="text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm font-medium text-primary">
              هر روز مزایده‌های تازه‌تری اضافه می‌شه؛ بپیوند و اولین پیشنهادت رو
              همین امروز ثبت کن!
            </p>
          </div>
        </section>

        <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
          <SectionHead
            title="چرا مزایده‌گاه؟"
            text="هر آنچه برای یک مزایده‌ی قابل‌اعتماد لازم است."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="space-y-3 rounded-2xl border border-line bg-surface p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <r.icon size={22} />
                </span>
                <h3 className="font-bold">{r.title}</h3>
                <p className="text-sm leading-7 text-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="partners"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12"
        >
          <SectionHead
            title="همکاران ما"
            text="با مجموعه‌هایی همکاری می‌کنیم که خرید و فروش را مطمئن‌تر و آسان‌تر می‌کنند."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-5 text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary"
                >
                  {p.name.charAt(0)}
                </span>
                <div className="space-y-0.5">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-xs text-muted">{p.field}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
            <Handshake size={18} className="text-primary" />
            مایل به همکاری با ما هستید؟ از بخش پشتیبانی تیکت ثبت کنید.
          </p>
        </section>

        <section
          id="sell"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12"
        >
          <div className="grid items-center gap-8 rounded-3xl bg-primary-soft p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Store size={26} className="text-primary" />
                <h2 className="text-2xl font-bold">
                  کالایی برای فروش دارید؟ آن را به مزایده بگذارید
                </h2>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-muted">
                  پنل ویژه‌ی فروشنده
                </span>
              </div>
              <p className="leading-8 text-muted">
                کالایی که دیگه بهش نیازی نداری رو به مزایده بذار و بذار
                علاقه‌مندها برای خریدش رقابت کنن.
              </p>
              <ul className="space-y-2">
                {sellerPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check size={18} className="shrink-0 text-success" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {showSellerCta &&
              (user ? (
                <Link to="/seller/new" className={`text-center ${primaryBtn}`}>
                  ساخت مزایده‌ی جدید
                </Link>
              ) : (
                <Link
                  to="/signup"
                  state={{ role: "seller" }}
                  className={`text-center ${primaryBtn}`}
                >
                  ثبت‌نام به‌عنوان فروشنده
                </Link>
              ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-12">
          <SectionHead
            title="سؤالات متداول"
            text="پاسخ پرسش‌هایی که بیشتر مطرح می‌شوند."
          />
          <Faq />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="space-y-5 rounded-3xl border border-line bg-surface px-6 py-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {user ? "بازگشت به پنل کاربری" : "آماده‌ی شروع هستید؟"}
            </h2>
            <p className="text-muted">
              {user
                ? "مزایده‌های شما در پنل در انتظار شما هستند."
                : "ثبت‌نام تنها چند ثانیه زمان می‌برد."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <Link to={dashboard} className={primaryBtn}>
                  رفتن به داشبورد
                </Link>
              ) : (
                <Link to="/signup" className={primaryBtn}>
                  ایجاد حساب کاربری
                </Link>
              )}
              <Link to="/auctions" className={outlineBtn}>
                مشاهده‌ی مزایده‌ها
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
          <span>© اوج‌بها • پروژه‌ی درس طراحی واسط کاربری</span>
          <a
            href="https://github.com/Sajjad-008"
            target="_blank"
            rel="noreferrer"
            aria-label="پروفایل گیت‌هاب سازنده (Sajjad-008)"
            title="GitHub: Sajjad-008"
            className="rounded-lg p-2 text-fg transition-colors hover:bg-hover hover:text-primary active:bg-primary-soft"
          >
            <GithubIcon size={22} />
          </a>
        </div>
      </footer>
    </div>
  );
}
