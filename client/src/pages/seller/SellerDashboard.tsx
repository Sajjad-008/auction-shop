import { Link } from "react-router-dom";
import {
  CircleCheck,
  CircleDollarSign,
  Package,
  Plus,
  Timer,
} from "lucide-react";
import AnimatedNumber from "../../components/AnimatedNumber";
import SellerAuctionRow from "../../components/SellerAuctionRow";
import useAppContext from "../../hooks/useAppContext";
import { isEnded } from "../../utils/auction";

export default function SellerDashboard() {
  const { auctions, user } = useAppContext();
  const mine = auctions.filter((a) => a.sellerEmail === user?.email);
  const active = mine.filter((a) => !isEnded(a));
  const totalBids = mine.reduce((sum, a) => sum + a.bids.length, 0);
  const recent = [...mine].sort((a, b) => b.id - a.id).slice(0, 3);

  const stats = [
    { icon: Package, label: "کل مزایده‌ها", value: mine.length },
    { icon: Timer, label: "در جریان", value: active.length },
    {
      icon: CircleCheck,
      label: "پایان‌یافته",
      value: mine.length - active.length,
    },
    { icon: CircleDollarSign, label: "مجموع پیشنهادها", value: totalBids },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">سلام {user?.name}</h2>
          <p className="text-sm text-muted">
            وضعیت مزایده‌هات رو از اینجا دنبال کن.
          </p>
        </div>
        <Link
          to="/seller/new"
          className="flex items-center gap-2 rounded-xl bg-btn px-5 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          <Plus size={18} />
          ساخت مزایده
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="space-y-3 rounded-2xl border border-line bg-surface p-5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <s.icon size={20} />
            </span>
            <p className="text-3xl font-bold">
              <AnimatedNumber value={s.value} />
            </p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">آخرین مزایده‌ها</h2>
          {mine.length > 0 && (
            <Link
              to="/seller/auctions"
              className="text-sm font-bold text-primary hover:underline"
            >
              دیدن همه
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-14 text-center">
            <Package size={40} className="text-muted" />
            <p className="text-muted">هنوز مزایده‌ای نساختی.</p>
            <Link
              to="/seller/new"
              className="font-bold text-primary hover:underline"
            >
              ساخت اولین مزایده
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((a) => (
              <SellerAuctionRow key={a.id} auction={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
