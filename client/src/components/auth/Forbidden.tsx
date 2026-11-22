import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, LifeBuoy, Lock } from "lucide-react";
import { animate, createScope } from "animejs";
import { panelPath, roleLabels } from "../../utils/paths";
import type { Role } from "../../types";

interface Props {
  requiredRole: Role;
  currentRole: Role;
}

const primaryBtn =
  "flex items-center gap-2 rounded-xl bg-btn px-5 py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active";
const outlineBtn =
  "flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 font-medium transition-colors hover:bg-hover active:bg-primary-soft";

export default function Forbidden({ requiredRole, currentRole }: Props) {
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);
  const canGoBack = window.history.length > 1;

  useEffect(() => {
    const previous = document.title;
    document.title = "دسترسی غیرمجاز | اوج‌بها";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scope = createScope({ root: root.current }).add(() => {
      animate(".fb-lock", {
        rotate: [0, 12],
        duration: 120,
        ease: "inOutQuad",
        loop: 4,
        alternate: true,
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <div
      ref={root}
      className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-surface px-6 py-14 text-center"
    >
      <div
        dir="ltr"
        aria-hidden="true"
        className="flex items-center gap-3 text-7xl font-bold leading-none text-danger sm:text-8xl"
      >
        <span>۴</span>
        <span className="flex size-20 items-center justify-center rounded-full bg-danger-soft sm:size-28">
          <span
            className="fb-lock inline-flex"
            style={{ transformOrigin: "50% 80%" }}
          >
            <Lock className="size-10 sm:size-14" />
          </span>
        </span>
        <span>۳</span>
      </div>

      <div className="max-w-xl space-y-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          دسترسی به این بخش مجاز نیست
        </h1>
        <p className="leading-8 text-muted">
          این بخش مخصوص حساب {roleLabels[requiredRole]} است و حساب کاربری فعلی
          شما ({roleLabels[currentRole]}) به آن دسترسی ندارد.
        </p>
        <p className="text-sm text-muted">
          اگر فکر می‌کنید این پیام اشتباه است، موضوع را از طریق بخش پشتیبانی
          اطلاع دهید.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to={panelPath(currentRole)} className={primaryBtn}>
          <LayoutDashboard size={18} />
          بازگشت به پنل کاربری
        </Link>
        <Link to="/support/new" className={outlineBtn}>
          <LifeBuoy size={18} />
          گزارش مشکل دسترسی
        </Link>
        {canGoBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={outlineBtn}
          >
            <ArrowRight size={18} />
            بازگشت به صفحه‌ی قبل
          </button>
        )}
      </div>
    </div>
  );
}
