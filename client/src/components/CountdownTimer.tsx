import { useEffect, useState } from "react";

const fa = (n: number) =>
  new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(n);

export default function CountdownTimer({ endAt }: { endAt: string }) {
  const [left, setLeft] = useState(
    () => new Date(endAt).getTime() - Date.now(),
  );

  useEffect(() => {
    const id = setInterval(
      () => setLeft(new Date(endAt).getTime() - Date.now()),
      1000,
    );
    return () => clearInterval(id);
  }, [endAt]);

  if (left <= 0) {
    return (
      <span className="rounded-full bg-line px-3 py-1 text-sm font-bold text-muted">
        پایان یافته
      </span>
    );
  }

  const total = Math.floor(left / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const urgent = left < 5 * 60 * 1000;

  return (
    <span
      dir="ltr"
      className={`rounded-full px-3 py-1 text-sm font-bold ${
        urgent ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary"
      }`}
    >
      {fa(h)}:{fa(m)}:{fa(s)}
    </span>
  );
}
