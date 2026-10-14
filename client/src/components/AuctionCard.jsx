import CountdownTimer from "./CountdownTimer";

export default function AuctionCard({ auction }) {
  const { title, currentPrice, bidCount, endAt } = auction;
  const ended = new Date(endAt) <= Date.now();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="h-44 bg-line" />
      <div className="space-y-3 p-4">
        <h2 className="font-bold">{title}</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">قیمت فعلی</p>
            <p className="text-xl font-bold text-primary">
              {currentPrice.toLocaleString("fa-IR")} تومان
            </p>
          </div>
          <CountdownTimer endAt={endAt} />
        </div>

        <p className="text-sm text-muted">
          {bidCount.toLocaleString("fa-IR")} پیشنهاد ثبت شده
        </p>

        <button
          disabled={ended}
          className="w-full rounded-xl bg-btn py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          {ended ? "مزایده پایان یافته" : "ثبت پیشنهاد"}
        </button>
      </div>
    </div>
  );
}
