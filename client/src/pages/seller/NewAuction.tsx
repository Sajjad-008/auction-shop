import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuctionImage from "../../components/AuctionImage";
import Dropdown from "../../components/Dropdown";
import FormField from "../../components/FormField";
import ImagePicker from "../../components/ImagePicker";
import MoneyField from "../../components/MoneyField";
import useAppContext from "../../hooks/useAppContext";
import { categories } from "../../data/categories";
import { formatToman } from "../../utils/auction";
import { shrinkImage } from "../../utils/image";
import type { CategoryKey, Option } from "../../types";

const categoryOptions: Option<CategoryKey>[] = categories.map((c) => ({
  key: c.key,
  label: c.label,
}));

const durations: Option[] = [
  { key: "10", label: "۱۰ دقیقه (نمایشی)" },
  { key: "60", label: "۱ ساعت" },
  { key: "360", label: "۶ ساعت" },
  { key: "1440", label: "۱ روز" },
  { key: "4320", label: "۳ روز" },
  { key: "10080", label: "۷ روز" },
];

export default function NewAuction() {
  const { createAuction } = useAppContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryKey>("electronics");
  const [description, setDescription] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [bidStep, setBidStep] = useState("");
  const [duration, setDuration] = useState("1440");
  const [images, setImages] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const sp = Number(startPrice);
  const st = Number(bidStep);

  const errors = {
    title: title.trim().length < 5 ? "عنوان باید حداقل ۵ حرف باشد." : "",
    description:
      description.trim().length < 20 ? "توضیحات باید حداقل ۲۰ حرف باشد." : "",
    startPrice: sp < 100_000 ? "قیمت پایه باید حداقل ۱۰۰٬۰۰۰ تومان باشد." : "",
    bidStep:
      st < 10_000
        ? "گام پیشنهاد باید حداقل ۱۰٬۰۰۰ تومان باشد."
        : sp && st > sp
          ? "گام پیشنهاد نباید از قیمت پایه بیشتر باشد."
          : "",
  };
  const show = (k: keyof typeof errors) =>
    (touched[k] || submitted) && errors[k];
  const blur = (k: keyof typeof errors) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (busy || Object.values(errors).some(Boolean)) return;
    setBusy(true);
    const image = images[0] ? await shrinkImage(images[0]) : "";
    createAuction({
      title: title.trim(),
      category,
      description: description.trim(),
      startPrice: sp,
      bidStep: st,
      durationMinutes: Number(duration),
      image,
    });
    navigate("/seller/auctions");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6"
      >
        <h2 className="text-xl font-bold">ساخت مزایده‌ی جدید</h2>

        <FormField
          label="عنوان مزایده"
          name="title"
          placeholder="مثلاً: ساعت مچی کلاسیک رترو"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={blur("title")}
          error={show("title")}
        />

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">دسته‌بندی</span>
          <Dropdown
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            ariaLabel="دسته‌بندی مزایده"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MoneyField
            label="قیمت پایه (تومان)"
            name="startPrice"
            placeholder="۱۰٬۰۰۰٬۰۰۰"
            value={startPrice}
            onChange={setStartPrice}
            onBlur={blur("startPrice")}
            error={show("startPrice")}
          />
          <MoneyField
            label="گام پیشنهاد (تومان)"
            name="bidStep"
            placeholder="۲۵۰٬۰۰۰"
            value={bidStep}
            onChange={setBidStep}
            onBlur={blur("bidStep")}
            error={show("bidStep")}
            hint="هر پیشنهاد جدید حداقل این‌قدر بالاتر باشه"
          />
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">مدت مزایده</span>
          <Dropdown
            value={duration}
            onChange={setDuration}
            options={durations}
            ariaLabel="مدت مزایده"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="auction-desc" className="block text-sm font-medium">
            توضیحات
          </label>
          <textarea
            id="auction-desc"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={blur("description")}
            placeholder="وضعیت کالا، ملحقات و هر نکته‌ی مهم دیگه..."
            aria-invalid={!!show("description")}
            className={`w-full resize-y rounded-xl border bg-bg px-4 py-3 outline-none transition-colors ${
              show("description")
                ? "border-danger"
                : "border-line focus:border-primary"
            }`}
          />
          {show("description") && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">عکس کالا (اختیاری)</span>
          <ImagePicker images={images} onChange={setImages} max={1} />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-btn py-3 font-bold text-white transition-colors enabled:hover:bg-btn-hover enabled:active:bg-btn-active disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "در حال انتشار..." : "انتشار مزایده"}
        </button>
      </form>

      <aside className="h-fit space-y-3 lg:sticky lg:top-24">
        <p className="text-sm font-bold text-muted">پیش‌نمایش کارت</p>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <AuctionImage
            src={images[0]}
            alt="پیش‌نمایش عکس"
            className="h-44 w-full"
          />
          <div className="space-y-2 p-4">
            <p className="font-bold">{title.trim() || "عنوان مزایده"}</p>
            <p className="text-xs text-muted">قیمت پایه</p>
            <p className="text-xl font-bold text-primary">
              {formatToman(sp || 0)}
            </p>
            <p className="text-sm text-muted">
              گام پیشنهاد: {formatToman(st || 0)}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
