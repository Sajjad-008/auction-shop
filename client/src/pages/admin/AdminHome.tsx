import { ShieldCheck } from "lucide-react";

export default function AdminHome() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-14 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <ShieldCheck size={32} />
      </span>
      <h2 className="text-xl font-bold">پنل مدیریت</h2>
      <p className="max-w-md leading-8 text-muted">
        این بخش در حال توسعه است. مدیریت کاربران، بررسی مزایده‌ها و پاسخ به
        تیکت‌ها در مراحل بعد به آن افزوده می‌شود.
      </p>
    </div>
  );
}
