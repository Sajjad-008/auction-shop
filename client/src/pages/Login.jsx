import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import { validateEmail, validateRequired } from "../utils/validation";

export default function Login({ user, onAuth, dark, onToggleTheme }) {
  const navigate = useNavigate();
  const from = useLocation().state?.from ?? "/";
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const errors = {
    email: validateEmail(values.email),
    password: validateRequired(values.password),
  };
  const show = (k) => (touched[k] || submitted) && errors[k];

  const handleChange = (e) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const email = values.email.trim();
    onAuth({ name: email.split("@")[0], email });
    navigate(from, { replace: true });
  };

  return (
    <AuthShell
      title="ورود به حساب"
      subtitle="برای ثبت پیشنهاد وارد شو"
      dark={dark}
      onToggleTheme={onToggleTheme}
      footer={
        <>
          حساب نداری؟{" "}
          <Link
            to="/signup"
            state={{ from }}
            className="font-bold text-primary hover:underline"
          >
            ثبت‌نام کن
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={show("password")}
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-btn py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </button>
      </form>
    </AuthShell>
  );
}
