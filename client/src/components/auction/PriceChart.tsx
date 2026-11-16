import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { formatToman, timeAgo } from "../../utils/auction";
import type { Auction } from "../../types";

interface Point {
  key: string;
  t: number;
  price: number;
  label: string;
  at?: string;
}

const X_MIN = 3;
const X_MAX = 97;
const Y_MIN = 6;
const Y_MAX = 94;
const MINUTE = 60_000;

const niceStep = (raw: number): number => {
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * pow;
};

export default function PriceChart({ auction }: { auction: Auction }) {
  const [active, setActive] = useState<number | null>(null);

  const bids = [...auction.bids].sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );

  if (bids.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
        هنوز پیشنهادی ثبت نشده است؛ پس از ثبت نخستین پیشنهاد، نمودار تغییرات
        قیمت نمایش داده می‌شود.
      </div>
    );
  }

  const tFirst = new Date(bids[0].at).getTime();
  const tLast = new Date(bids[bids.length - 1].at).getTime();

  const pad = Math.max((tLast - tFirst) * 0.15, 10 * MINUTE);
  const tStart = tFirst - pad;
  const span = tLast - tStart;

  const points: Point[] = [
    { key: "base", t: tStart, price: auction.startPrice, label: "قیمت پایه" },
    ...bids.map((b, i) => ({
      key: `bid-${i}`,
      t: new Date(b.at).getTime(),
      price: b.amount,
      label: b.user,
      at: b.at,
    })),
  ];

  const prices = points.map((p) => p.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const margin = Math.max((hi - lo) * 0.2, lo * 0.02, 1);
  const domainLo = lo - margin;
  const domainHi = hi + margin;

  const px = (t: number) => X_MIN + ((t - tStart) / span) * (X_MAX - X_MIN);
  const py = (price: number) =>
    Y_MAX - ((price - domainLo) / (domainHi - domainLo)) * (Y_MAX - Y_MIN);

  const step = niceStep((domainHi - domainLo) / 4);
  const ticks: number[] = [];
  for (
    let v = Math.ceil(domainLo / step) * step;
    v <= domainHi && ticks.length < 8;
    v += step
  ) {
    ticks.push(v);
  }

  const inMillions = hi >= 1_000_000;
  const tickLabel = (v: number) =>
    inMillions
      ? (v / 1_000_000).toLocaleString("fa-IR", { maximumFractionDigits: 2 })
      : v.toLocaleString("fa-IR");

  const coords = points.map((p) => ({ x: px(p.t), y: py(p.price) }));
  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");
  const area = `${line} L ${coords[coords.length - 1].x} 100 L ${coords[0].x} 100 Z`;

  const first = points[0].price;
  const last = points[points.length - 1].price;
  const change = ((last - first) / first) * 100;
  const hovered =
    active !== null ? { p: points[active], c: coords[active] } : null;

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">قیمت فعلی</p>
          <p className="text-xl font-bold text-primary">{formatToman(last)}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
          <TrendingUp size={14} aria-hidden="true" />
          {change.toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪ نسبت
          به قیمت پایه
        </span>
      </div>

      <div dir="ltr">
        <div
          role="group"
          aria-label="نمودار تغییرات قیمت"
          className="relative h-56 sm:h-64"
        >
          <div className="absolute inset-y-0 left-0 w-14" aria-hidden="true">
            {ticks.map((v) => (
              <span
                key={v}
                className="absolute right-2 -translate-y-1/2 text-xs text-muted"
                style={{ top: `${py(v)}%` }}
              >
                {tickLabel(v)}
              </span>
            ))}
          </div>

          <div className="absolute inset-y-0 left-14 right-0">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {ticks.map((v) => (
                <line
                  key={v}
                  x1="0"
                  x2="100"
                  y1={py(v)}
                  y2={py(v)}
                  className="stroke-line"
                  strokeDasharray="3 4"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path d={area} className="fill-primary/10" />
              <path
                d={line}
                className="fill-none stroke-primary"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {points.map((p, i) => (
              <button
                key={p.key}
                type="button"
                aria-label={`${p.label}: ${formatToman(p.price)}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(i)}
                style={{ left: `${coords[i].x}%`, top: `${coords[i].y}%` }}
                className={`absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform hover:scale-125 focus-visible:scale-125 ${
                  p.key === "base"
                    ? "border-primary bg-surface"
                    : "border-surface bg-primary"
                }`}
              />
            ))}

            {hovered && (
              <div
                dir="rtl"
                className={`pointer-events-none absolute z-10 w-max max-w-40 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-right text-xs shadow-lg ${
                  hovered.c.y < 30 ? "mt-3" : "-mt-3 -translate-y-full"
                }`}
                style={{
                  left: `clamp(5rem, ${hovered.c.x}%, calc(100% - 5rem))`,
                  top: `${hovered.c.y}%`,
                }}
              >
                <p className="font-bold text-primary">
                  {formatToman(hovered.p.price)}
                </p>
                <p className="text-muted">
                  {hovered.p.label}
                  {hovered.p.at ? ` • ${timeAgo(hovered.p.at)}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pl-14">
          <div className="flex justify-between px-[3%] text-xs text-muted">
            <span dir="rtl">قیمت پایه</span>
            <span dir="rtl">
              آخرین پیشنهاد • {timeAgo(bids[bids.length - 1].at)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-6 text-muted">
        محور افقی زمان است (از چپ به راست) و محور عمودی قیمت (
        {inMillions ? "میلیون تومان" : "تومان"}). نقطه‌ی توخالی قیمت پایه است و
        فاصله‌ی آن تا نخستین پیشنهاد نمادین است.
      </p>
    </div>
  );
}
