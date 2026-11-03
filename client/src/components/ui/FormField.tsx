import { useState } from "react";
import type { ChangeEventHandler, FocusEventHandler } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string | false;
  placeholder?: string;
  ltr?: boolean;
  autoComplete?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  ltr = false,
  autoComplete,
}: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const id = `field-${name}`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          dir={ltr || isPassword ? "ltr" : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border bg-bg px-4 py-3 outline-none transition-colors ${
            ltr || isPassword ? "text-left" : ""
          } ${isPassword ? "pr-12" : ""} ${
            error ? "border-danger" : "border-line focus:border-primary"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "مخفی کردن رمز" : "نمایش رمز"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-hover active:bg-primary-soft"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
