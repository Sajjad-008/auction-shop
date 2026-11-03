import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CircleDollarSign,
  Gavel,
  Handshake,
  History,
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
import AnimatedNumber from "../components/AnimatedNumber";
import AuctionImage from "../components/AuctionImage";
import CountdownTimer from "../components/CountdownTimer";
import Faq from "../components/Faq";
import GithubIcon from "../components/GithubIcon";
import { categories } from "../data/categories";
import { partners } from "../data/partners";
import { formatToman, getCurrentPrice, isEnded } from "../utils/auction";
import type { Auction } from "../types";

interface Props {
  auctions: Auction[];
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
    title: "ثبت‌نام کن",
    text: "با ایمیل در چند ثانیه حساب بساز. دیدن مزایده‌ها بدون ثبت‌نام هم آزاده.",
  },
  {
    icon: CircleDollarSign,
    title: "پیشنهاد بده",
    text: "مزایده‌ی مورد نظرت رو انتخاب کن و پیشنهادی بالاتر از قیمت فعلی ثبت کن.",
  },
  {
    icon: Trophy,
    title: "برنده شو",
    text: "اگه تا پایان زمان در صدر باشی، برنده‌ی مزایده‌ای و اعلانش رو می‌گیری.",
  },
];

const reasons: Feature[] = [
  {
    icon: Timer,
    title: "تایمر زنده",
    text: "زمان باقی‌مونده هر لحظه نشون داده می‌شه و در ۵ دقیقه‌ی آخر قرمز می‌شه.",
  },
  {
    icon: History,
    title: "تاریخچه‌ی شفاف",
    text: "همه‌ی پیشنهادهای هر مزایده با مبلغ و زمانشون قابل مشاهده‌ست.",
  },
  {
    icon: ShieldCheck,
    title: "قوانین مشخص",
    text: "حداقل گام پیشنهاد معلومه و قبل از ثبت هر پیشنهاد، تأیید گرفته می‌شه.",
  },
  {
    icon: LifeBuoy,
    title: "پشتیبانی تیکتی",
    text: "هر سؤال یا مشکلی رو با دسته‌بندی و عکس برای پشتیبانی بفرست.",
  },
];

const sellerPoints = [
  "قیمت پایه و گام پیشنهاد رو خودت تعیین می‌کنی.",
  "تاریخچه‌ی پیشنهادها تا آخر مزایده شفاف می‌مونه.",
  "با اعلان و تیکت از همه‌چیز باخبر می‌شی.",
];

function SectionHead({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-8 space-y-2 text-center">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {text && <p className="mx-auto max-w-2xl text-muted">{text}</p>}
    </div>
  );
}

export default function Landing({ auctions, dark, onToggleTheme }: Props) {
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
            مزایده‌گاه
          </Link>

          <nav
            aria-label="بخش‌های صفحه"
            className="hidden items-center gap-6 text-sm md:flex"
          >
            <a
              href="#how"
              className="text-muted transition-colors hover:text-fg"
            >
              چطور کار می‌کنه؟
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
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary-soft px-4 py-1 text-sm font-medium text-primary">
              مزایده‌ی آنلاین
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              پیشنهاد بده، <span className="text-primary">برنده شو</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted">
              تایمر زنده، قیمت‌های شفاف و تاریخچه‌ی کامل پیشنهادها. توی
              مزایده‌گاه همه‌چیز جلوی چشم توئه.
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
                چطور کار می‌کنه؟
              </a>
            </div>
            <p className="text-sm text-muted">
              دیدن مزایده‌ها نیازی به ثبت‌نام نداره.
            </p>
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
            title="چطور کار می‌کنه؟"
            text="فقط سه قدم تا برنده شدن."
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
            text="هر چیزی که برای یه مزایده‌ی قابل‌اعتماد لازمه."
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
            text="با مجموعه‌هایی همکاری می‌کنیم که خرید و فروش رو مطمئن‌تر و راحت‌تر می‌کنن."
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
            مجموعه‌ی شما هم می‌خواد همکار ما بشه؟ از بخش پشتیبانی تیکت بزن.
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
                  کالایی داری؟ بذارش به مزایده
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
            <Link
              to="/signup"
              state={{ role: "seller" }}
              className={`text-center ${primaryBtn}`}
            >
              ثبت‌نام به‌عنوان فروشنده
            </Link>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-12">
          <SectionHead
            title="سؤالات متداول"
            text="جواب چیزهایی که بیشتر پرسیده می‌شه."
          />
          <Faq />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="space-y-5 rounded-3xl border border-line bg-surface px-6 py-12 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              آماده‌ای شروع کنی؟
            </h2>
            <p className="text-muted">ثبت‌نام چند ثانیه بیشتر طول نمی‌کشه.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/signup" className={primaryBtn}>
                ساخت حساب
              </Link>
              <Link to="/auctions" className={outlineBtn}>
                دیدن مزایده‌ها
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
          <span>© مزایده‌گاه • پروژه‌ی درس طراحی واسط کاربری</span>
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
