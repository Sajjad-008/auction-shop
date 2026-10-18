import { Link } from "react-router-dom";
import AuctionImage from "./AuctionImage";
import CountdownTimer from "./CountdownTimer";
import FavoriteButton from "./FavoriteButton";
import { getCurrentPrice, isEnded, formatToman } from "../utils/auction";

export default function AuctionCard({ auction }) {
  const ended = isEnded(auction);
  const to = `/auction/${auction.id}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative">
        <Link to={to} className="block">
          <AuctionImage
            src={auction.image}
            alt={auction.title}
            className="h-44 w-full"
          />
        </Link>
        <FavoriteButton
          auctionId={auction.id}
          className="absolute left-3 top-3 rounded-full border border-line bg-surface/90 p-2 backdrop-blur"
        />
      </div>

      <div className="space-y-3 p-4">
        <Link to={to} className="block font-bold hover:text-primary">
          {auction.title}
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">قیمت فعلی</p>
            <p className="text-xl font-bold text-primary">
              {formatToman(getCurrentPrice(auction))}
            </p>
          </div>
          <CountdownTimer endAt={auction.endAt} />
        </div>

        <p className="text-sm text-muted">
          {auction.bids.length.toLocaleString("fa-IR")} پیشنهاد ثبت شده
        </p>

        {ended ? (
          <button
            disabled
            className="w-full rounded-xl bg-line py-3 font-bold text-muted disabled:cursor-not-allowed"
          >
            مزایده پایان یافته
          </button>
        ) : (
          <Link
            to={to}
            className="block w-full rounded-xl bg-btn py-3 text-center font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
          >
            ثبت پیشنهاد
          </Link>
        )}
      </div>
    </div>
  );
}
