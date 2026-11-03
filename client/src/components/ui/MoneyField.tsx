import type { ChangeEvent } from "react";
import { toEnglishDigits } from "../../utils/auction";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (digits: string) => void;
  onBlur?: () => void;
  error?: string | false;
  hint?: string;
  placeholder?: string;
}

export default function MoneyField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
}: Props) {
  const id = `field-${name}`;
  const handle = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(toEnglishDigits(e.target.value).slice(0, 12));

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        value={value ? Number(value).toLocaleString("fa-IR") : ""}
        onChange={handle}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-bg px-4 py-3 outline-none transition-colors ${
          error ? "border-danger" : "border-line focus:border-primary"
        }`}
      />
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
