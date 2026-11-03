import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ShoppingBag, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from "../utils/validation";
import type { Role, User } from "../types";
import { panelPath } from "../utils/paths";

interface Props {
  user: User | null;
  onRegister: (user: User) => void;
  dark: boolean;
  onToggleTheme: () => void;
}

const roleOptions: {
  key: Role;
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    key: "buyer",
    icon: ShoppingBag,
    title: "خریدار",
    text: "پیشنهاد می‌دم و مزایده‌ها رو دنبال می‌کنم.",
  },
  {
    key: "seller",
    icon: Store,
    title: "فروشنده",
    text: "کالام رو به مزایده می‌ذارم.",
  },
];

export default function Signup({
  user,
  onRegister,
  dark,
  onToggleTheme,
}: Props) {
  const state = useLocation().state as { from?: string; role?: Role } | null;
  const from = state?.from;
  const [role, setRole] = useState<Role>(state?.role ?? "buyer");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  if (user) return <Navigate to={from ?? panelPath(user.role)} replace />;

  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirm: validateConfirm(values.password, values.confirm),
    terms: values.terms ? "" : "پذیرش قوانین الزامی است.",
  };
  const show = (k: keyof typeof errors) =>
    (touched[k] || submitted) && errors[k];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    onRegister({ name: values.name.trim(), email: values.email.trim(), role });
  };

  return (
    <AuthShell
      title="ساخت حساب جدید"
      subtitle="با چند قدم ساده وارد مزایده‌ها شو"
      dark={dark}
      onToggleTheme={onToggleTheme}
      footer={
        <>
          حساب داری؟{" "}
          <Link
            to="/login"
            state={{ from }}
            className="font-bold text-primary hover:underline"
          >
            وارد شو
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <span id="role-label" className="block text-sm font-medium">
            نوع حساب
          </span>
          <div
            role="radiogroup"
            aria-labelledby="role-label"
            className="grid grid-cols-2 gap-3"
          >
            {roleOptions.map((r) => {
              const on = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setRole(r.key)}
                  className={`space-y-1 rounded-xl border p-3 text-right transition-colors active:bg-primary-soft ${
                    on
                      ? "border-primary bg-primary-soft"
                      : "border-line bg-surface hover:bg-hover"
                  }`}
                >
                  <span
                    className={`flex items-center gap-2 font-bold ${on ? "text-primary" : ""}`}
                  >
                    <r.icon size={18} />
                    {r.title}
                  </span>
                  <span className="block text-xs text-muted">{r.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <FormField
          label="نام و نام خانوادگی"
          name="name"
          autoComplete="name"
          placeholder="علی رضایی"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={show("name")}
        />
        <FormField
          label="ایمیل"
          name="email"
          type="email"
          ltr
          autoComplete="email"
          placeholder="example@mail.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={show("email")}
        />
        <FormField
          label="رمز عبور"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="حداقل ۸ کاراکتر"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={show("password")}
        />
        <FormField
          label="تکرار رمز عبور"
          name="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirm}
          onChange={handleChange}
          onBlur={handleBlur}
          error={show("confirm")}
        />

        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-4 w-4 cursor-pointer accent-[var(--btn)]"
            />
            قوانین و شرایط استفاده را می‌پذیرم
          </label>
          {show("terms") && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.terms}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-btn py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ایجاد حساب
        </button>
      </form>
    </AuthShell>
  );
}
