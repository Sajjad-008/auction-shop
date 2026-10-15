import { Link, useParams, useOutletContext } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuctionImage from "../components/AuctionImage";
import CountdownTimer from "../components/CountdownTimer";
import StatusBadge from "../components/StatusBadge";
import BidForm from "../components/BidForm";
import BidHistory from "../components/BidHistory";
import { getCurrentPrice, getMyStatus, formatToman } from "../utils/auction";

export default function AuctionDetail() {
  const { id } = useParams();
  const { auctions, placeBid } = useOutletContext();
  const auction = auctions.find((a) => a.id === Number(id));

  if (!auction)
    return (
      <div className="space-y-3">
        <p>این مزایده پیدا نشد.</p>
        <Link to="/" className="text-primary hover:underline">
          بازگشت به لیست
        </Link>
      </div>
    );

  const status = getMyStatus(auction);

  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowRight size={16} /> بازگشت به لیست
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <AuctionImage
            src={auction.image}
            alt={auction.title}
            className="h-72 w-full rounded-2xl sm:h-96"
          />
          <section className="space-y-2">
            <h2 className="text-lg font-bold">توضیحات</h2>
            <p className="leading-8 text-muted">{auction.description}</p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-bold">تاریخچه پیشنهادها</h2>
            <BidHistory bids={auction.bids} />
          </section>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold">{auction.title}</h2>
          <div className="flex items-center justify-between">
            <StatusBadge status={status} />
            <CountdownTimer endAt={auction.endAt} />
          </div>
          <div className="rounded-2xl bg-primary-soft p-4">
            <p className="text-sm text-muted">قیمت فعلی</p>
            <p className="text-3xl font-bold text-primary">
              {formatToman(getCurrentPrice(auction))}
            </p>
            <p className="mt-1 text-xs text-muted">
              {auction.bids.length.toLocaleString("fa-IR")} پیشنهاد ثبت شده
            </p>
          </div>
          <BidForm auction={auction} onBid={placeBid} />
        </aside>
      </div>
    </div>
  );
}
