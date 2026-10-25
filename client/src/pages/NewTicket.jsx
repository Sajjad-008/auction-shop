import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ArrowRight, LifeBuoy } from "lucide-react";
import Dropdown from "../components/Dropdown";
import FormField from "../components/FormField";
import ImagePicker from "../components/ImagePicker";
import { ticketCategories } from "../data/ticketCategories";

export default function NewTicket() {
  const { user, tickets } = useOutletContext();
  const navigate = useNavigate();
  const [category, setCategory] = useState("technical");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!user)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
        <LifeBuoy size={40} className="text-muted" />
        <p className="text-muted">برای ثبت تیکت اول وارد شو.</p>
        <Link
          to="/login"
          state={{ from: "/support/new" }}
          className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </Link>
      </div>
    );

  const errors = {
    title: title.trim().length < 5 ? "عنوان باید حداقل ۵ حرف باشد." : "",
    message:
      message.trim().length < 10 ? "متن پیام باید حداقل ۱۰ حرف باشد." : "",
  };
  const show = (k) => (touched[k] || submitted) && errors[k];
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const number = tickets.create({
      category,
      title: title.trim(),
      message: message.trim(),
      images,
    });
    navigate(`/support/${number}`);
  };

  return (
    <div className="space-y-4">
      <Link
        to="/support"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowRight size={16} /> بازگشت به تیکت‌ها
      </Link>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6"
      >
        <h2 className="text-xl font-bold">ثبت تیکت جدید</h2>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">دسته‌بندی</span>
          <Dropdown
            value={category}
            onChange={setCategory}
            options={ticketCategories}
            ariaLabel="دسته‌بندی تیکت"
          />
        </div>

        <FormField
          label="عنوان"
          name="title"
          placeholder="مثلاً: دکمه‌ی ثبت پیشنهاد کار نمی‌کند"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={blur("title")}
          error={show("title")}
        />

        <div className="space-y-1.5">
          <label htmlFor="ticket-message" className="block text-sm font-medium">
            متن پیام
          </label>
          <textarea
            id="ticket-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={blur("message")}
            placeholder="مشکل یا سؤالت رو با جزئیات بنویس..."
            aria-invalid={!!show("message")}
            className={`w-full resize-y rounded-xl border bg-bg px-4 py-3 outline-none transition-colors ${
              show("message")
                ? "border-danger"
                : "border-line focus:border-primary"
            }`}
          />
          {show("message") && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">پیوست (اختیاری)</span>
          <ImagePicker images={images} onChange={setImages} />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-btn py-3 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ارسال تیکت
        </button>
      </form>
    </div>
  );
}
