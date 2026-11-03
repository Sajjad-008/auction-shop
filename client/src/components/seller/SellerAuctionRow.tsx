import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AuctionImage from "../auction/AuctionImage";
import CountdownTimer from "../auction/CountdownTimer";
import { categories } from "../../data/categories";
import { formatToman, getCurrentPrice } from "../../utils/auction";
import type { Auction } from "../../types";

interface Props {
  auction: Auction;
  onDelete?: (id: number) => void;
}

export default function SellerAuctionRow({ auction, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const cat = categories.find((c) => c.key === auction.category);
  const hasBids = auction.bids.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-3">
      <Link
        to={`/auction/${auction.id}`}
        className="flex min-w-0 flex-1 items-center gap-4"
      >
        <AuctionImage
          src={auction.image}
          alt={auction.title}
          className="h-20 w-20 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-bold">{auction.title}</p>
          <p className="text-sm text-muted">
            {cat?.label} • {auction.bids.length.toLocaleString("fa-IR")} پیشنهاد
          </p>
          <p className="text-sm">
            قیمت فعلی: {formatToman(getCurrentPrice(auction))}
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <CountdownTimer endAt={auction.endAt} />

        {onDelete &&
          (confirming ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">حذف بشه؟</span>
              <button
                onClick={() => onDelete(auction.id)}
                className="rounded-lg bg-danger-soft px-3 py-1.5 font-bold text-danger transition-colors hover:bg-hover"
              >
                بله
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:bg-hover active:bg-primary-soft"
              >
                خیر
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              disabled={hasBids}
              aria-label="حذف مزایده"
              title={
                hasBids ? "مزایده‌ای که پیشنهاد دارد حذف نمی‌شود" : "حذف مزایده"
              }
              className="rounded-lg border border-line p-2 text-danger transition-colors enabled:hover:bg-danger-soft enabled:active:bg-danger-soft disabled:cursor-not-allowed disabled:text-muted"
            >
              <Trash2 size={18} />
            </button>
          ))}
      </div>
    </div>
  );
}
