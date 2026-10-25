import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_SIZE = 1024 * 1024;

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ImagePicker({ images, onChange, max = 2 }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const full = images.length >= max;

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    setError("");

    const room = max - images.length;
    const accepted = [];

    for (const f of files.slice(0, room)) {
      if (!f.type.startsWith("image/")) {
        setError("فقط فایل تصویری مجاز است.");
        continue;
      }
      if (f.size > MAX_SIZE) {
        setError("حجم هر عکس باید کمتر از ۱ مگابایت باشد.");
        continue;
      }
      accepted.push(await readFile(f));
    }

    if (files.length > room)
      setError(`حداکثر ${max.toLocaleString("fa-IR")} عکس می‌تونی بفرستی.`);
    if (accepted.length) onChange([...images, ...accepted]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={full}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm transition-colors enabled:hover:bg-hover enabled:active:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted"
        >
          <ImagePlus size={18} />
          افزودن عکس
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
          aria-label="انتخاب عکس"
        />

        {images.map((src, i) => (
          <div key={i} className="relative">
            <img
              src={src}
              alt={`پیوست ${i + 1}`}
              className="h-12 w-12 rounded-lg border border-line object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              aria-label="حذف عکس"
              className="absolute -right-2 -top-2 rounded-full border border-line bg-surface p-0.5 text-danger transition-colors hover:bg-danger-soft"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
