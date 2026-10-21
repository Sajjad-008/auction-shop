import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function Dropdown({
  value,
  onChange,
  options,
  ariaLabel,
  pill = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.key === value);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (key) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex items-center gap-2 whitespace-nowrap border border-line bg-surface text-sm transition-colors hover:bg-hover active:bg-primary-soft ${
          pill ? "rounded-full px-4 py-2" : "rounded-xl px-3 py-2"
        }`}
      >
        <span>{current?.label}</span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="listbox"
        aria-hidden={!open}
        className={`absolute start-0 z-20 mt-2 w-max min-w-full origin-top rounded-2xl border border-line bg-surface p-1.5 shadow-lg transition-all duration-200 ease-out ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {options.map((o) => {
          const selected = o.key === value;
          return (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={open ? 0 : -1}
              onClick={() => pick(o.key)}
              className={`flex w-full items-center justify-between gap-6 rounded-xl px-3 py-2 text-right text-sm transition-colors active:bg-primary-soft ${
                selected
                  ? "bg-primary-soft font-bold text-primary"
                  : "hover:bg-hover"
              }`}
            >
              <span>{o.label}</span>
              {selected && <Check size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
