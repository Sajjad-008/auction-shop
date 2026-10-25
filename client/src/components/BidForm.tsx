import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import {
  getMinNextBid,
  isEnded,
  formatToman,
  toEnglishDigits,
} from "../utils/auction";
import type { Auction, BidResult } from "../types";

interface Props {
  auction: Auction;
  onBid: (id: number, amount: number) => BidResult;
}

export default function BidForm({ auction, onBid }: Props) {
  const { user } = useAppContext();
  const { pathname } = useLocation();
  const [value, setValue] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<BidResult | null>(null);

  const ended = isEnded(auction);
  const min = getMinNextBid(auction);
  const amount = value ? Number(value) : 0;

  if (!user && !ended)
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-line bg-bg p-4 text-sm">
          <p className="font-medium">برای ثبت پیشنهاد باید وارد حسابت بشی.</p>
          <p className="mt-1 text-xs text-muted">
            حداقل پیشنهاد بعدی: {formatToman(min)}
          </p>
        </div>
        <Link
          to="/login"
          state={{ from: pathname }}
          className="block w-full rounded-xl bg-btn py-3 text-center font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود برای ثبت پیشنهاد
        </Link>
        <p className="text-center text-sm text-muted">
          حساب نداری؟{" "}
          <Link
            to="/signup"
            state={{ from: pathname }}
            className="font-bold text-primary hover:underline"
          >
            ثبت‌نام کن
          </Link>
        </p>
      </div>
    );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(toEnglishDigits(e.target.value));
    setConfirming(false);
    setFeedback(null);
  };

  const ask = () => {
    if (!amount)
      return setFeedback({ ok: false, message: "مبلغ پیشنهادت رو وارد کن." });
    if (amount < min)
      return setFeedback({
        ok: false,
        message: `حداقل پیشنهاد ${formatToman(min)} است.`,
      });
    setFeedback(null);
    setConfirming(true);
  };

  const submit = () => {
    const result = onBid(auction.id, amount);
    setFeedback(result);
    setConfirming(false);
    if (result.ok) setValue("");
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        مبلغ پیشنهاد شما (تومان)
      </label>
      <input
        type="text"
        inputMode="numeric"
        disabled={ended}
        value={value ? Number(value).toLocaleString("fa-IR") : ""}
        onChange={handleChange}
        placeholder={min.toLocaleString("fa-IR")}
        className={`w-full rounded-xl border bg-bg px-4 py-3 outline-none focus:border-primary disabled:opacity-50 ${
          feedback && !feedback.ok ? "border-danger" : "border-line"
        }`}
      />
      <div className="flex items-center justify-between text-xs text-muted">
        <span>حداقل پیشنهاد بعدی: {formatToman(min)}</span>
        {!ended && (
          <button
            type="button"
            onClick={() => {
              setValue(String(min));
              setFeedback(null);
              setConfirming(false);
            }}
            className="font-medium text-primary hover:underline"
          >
            استفاده از حداقل
          </button>
        )}
      </div>

      {feedback && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            feedback.ok
              ? "bg-success-soft text-success"
              : "bg-danger-soft text-danger"
          }`}
        >
          {feedback.message}
        </p>
      )}

      {confirming ? (
        <div className="space-y-2 rounded-xl border border-line p-3">
          <p className="text-sm">
            پیشنهاد <b>{formatToman(amount)}</b> ثبت بشه؟ بعد از ثبت قابل
            پس‌گرفتن نیست.
          </p>
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="flex-1 rounded-xl bg-btn py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
            >
              تأیید
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl border border-line py-2.5 font-medium transition-colors hover:bg-hover active:bg-primary-soft"
            >
              انصراف
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={ask}
          disabled={ended}
          className="w-full rounded-xl bg-btn py-3 font-bold text-white transition-colors enabled:hover:bg-btn-hover enabled:active:bg-btn-active disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          {ended ? "مزایده پایان یافته" : "ثبت پیشنهاد"}
        </button>
      )}
    </div>
  );
}
