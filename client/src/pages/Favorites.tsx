import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import AuctionCard from "../components/AuctionCard";
import useAppContext from "../hooks/useAppContext";

function Empty({ text, action }: { text: string; action: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
      <Heart size={40} className="text-muted" />
      <p className="text-muted">{text}</p>
      {action}
    </div>
  );
}

export default function Favorites() {
  const { auctions, user, favorites } = useAppContext();

  if (!user)
    return (
      <Empty
        text="برای دیدن علاقه‌مندی‌هات اول وارد شو."
        action={
          <Link
            to="/login"
            state={{ from: "/favorites" }}
            className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
          >
            ورود
          </Link>
        }
      />
    );

  const list = auctions.filter((a) => favorites.includes(a.id));

  if (list.length === 0)
    return (
      <Empty
        text="هنوز مزایده‌ای رو علاقه‌مندی نکردی. روی قلب کارت‌ها بزن."
        action={
          <Link to="/" className="font-bold text-primary hover:underline">
            دیدن مزایده‌ها
          </Link>
        }
      />
    );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((a) => (
        <AuctionCard key={a.id} auction={a} />
      ))}
    </div>
  );
}
