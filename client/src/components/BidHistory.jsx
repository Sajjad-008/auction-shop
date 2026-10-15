import { formatToman, timeAgo } from "../utils/auction";

export default function BidHistory({ bids }) {
  return (
    <div className="space-y-2">
      {bids.map((b, i) => (
        <div
          key={`${b.at}-${i}`}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
            i === 0
              ? "border-transparent bg-primary-soft"
              : "border-line bg-surface"
          }`}
        >
          <span className="font-medium">{b.user}</span>
          <span className={`font-bold ${i === 0 ? "text-primary" : ""}`}>
            {formatToman(b.amount)}
          </span>
          <span className="text-xs text-muted">{timeAgo(b.at)}</span>
        </div>
      ))}
    </div>
  );
}
