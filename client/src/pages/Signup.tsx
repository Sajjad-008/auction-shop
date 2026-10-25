import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirm,
} from "../utils/validation";
import type { User } from "../types";

interface Props {
  user: User | null;
  onAuth: (user: User) => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export default function Signup({ user, onAuth, dark, onToggleTheme }: Props) {
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/";
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  if (user) return <Navigate to={from} replace />;

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
    onAuth({ name: values.name.trim(), email: values.email.trim() });
    navigate(from, { replace: true });
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
