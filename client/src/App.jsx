import { useEffect, useState } from "react";

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={() => setDark(!dark)}
        className="mb-6 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium"
      >
        {dark ? "حالت روشن" : "حالت تاریک"}
      </button>

      <div className="max-w-sm overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="h-40 bg-line" />
        <div className="space-y-3 p-4">
          <h2 className="font-bold">ساعت مچی کلاسیک رترو</h2>
          <p className="text-2xl font-bold text-primary">۱۲٬۵۰۰٬۰۰۰ تومان</p>
          <p className="text-sm text-muted">۱۲ پیشنهاد ثبت شده</p>
          <button className="w-full rounded-xl bg-btn py-3 font-bold text-white">
            ثبت پیشنهاد
          </button>
        </div>
      </div>
    </div>
  );
}
