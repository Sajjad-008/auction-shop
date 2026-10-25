import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, LifeBuoy, Lock, RotateCcw, Send } from "lucide-react";
import ImagePicker from "../components/ImagePicker";
import TicketStatusBadge from "../components/TicketStatusBadge";
import useAppContext from "../hooks/useAppContext";
import { ticketCategories } from "../data/ticketCategories";
import { timeAgo } from "../utils/auction";
import { faNum } from "../utils/ticket";

export default function TicketChat() {
  const { number } = useParams<{ number: string }>();
  const { user, tickets } = useAppContext();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const ticket = tickets.items.find(
    (t) => t.number === Number(number) && t.userEmail === user?.email,
  );
  const count = ticket?.messages.length ?? 0;

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [count]);

  if (!user)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
        <LifeBuoy size={40} className="text-muted" />
        <p className="text-muted">برای دیدن تیکت اول وارد شو.</p>
        <Link
          to="/login"
          state={{ from: `/support/${number}` }}
          className="rounded-xl bg-btn px-6 py-2.5 font-bold text-white transition-colors hover:bg-btn-hover active:bg-btn-active"
        >
          ورود
        </Link>
      </div>
    );

  if (!ticket)
    return (
      <div className="space-y-3">
        <p>این تیکت پیدا نشد.</p>
        <Link to="/support" className="text-primary hover:underline">
          بازگشت به تیکت‌ها
        </Link>
      </div>
    );

  const cat = ticketCategories.find((c) => c.key === ticket.category);
  const closed = ticket.status === "closed";
  const canSend = text.trim().length > 0 || images.length > 0;

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSend) return;
    tickets.addMessage(ticket.number, { text: text.trim(), images });
    setText("");
    setImages([]);
  };

  return (
    <div className="space-y-4">
      <Link
        to="/support"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <ArrowRight size={16} /> بازگشت به تیکت‌ها
      </Link>

      <div className="rounded-2xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="min-w-0 space-y-1">
            <h2 className="truncate font-bold">{ticket.title}</h2>
            <p className="text-sm text-muted">
              #{faNum(ticket.number)} • {cat?.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            {closed ? (
              <button
                onClick={() => tickets.setStatus(ticket.number, "open")}
                className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm transition-colors hover:bg-hover active:bg-primary-soft"
              >
                <RotateCcw size={16} />
                بازگشایی
              </button>
            ) : (
              <button
                onClick={() => tickets.setStatus(ticket.number, "closed")}
                className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm transition-colors hover:bg-hover active:bg-primary-soft"
              >
                <Lock size={16} />
                بستن تیکت
              </button>
            )}
          </div>
        </div>

        <div
          ref={listRef}
          className="max-h-[55vh] space-y-4 overflow-y-auto p-4"
        >
          {ticket.messages.map((m) => {
            const mine = m.from === "user";
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] space-y-1 sm:max-w-[70%] ${mine ? "" : "text-left"}`}
                >
                  <div
                    className={`space-y-2 rounded-2xl px-4 py-3 text-right text-sm leading-7 ${
                      mine ? "bg-btn text-white" : "border border-line bg-bg"
                    }`}
                  >
                    {m.text && (
                      <p className="whitespace-pre-wrap break-words">
                        {m.text}
                      </p>
                    )}
                    {m.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`پیوست ${i + 1}`}
                            className="h-28 w-28 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="px-1 text-xs text-muted">
                    {mine
                      ? "تو"
                      : m.auto
                        ? "پشتیبانی • پاسخ خودکار (نمونه)"
                        : "پشتیبانی"}{" "}
                    • {timeAgo(m.at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {closed ? (
          <p className="border-t border-line p-4 text-center text-sm text-muted">
            این تیکت بسته شده است. برای ادامه‌ی گفتگو، آن را بازگشایی کن.
          </p>
        ) : (
          <form onSubmit={send} className="space-y-3 border-t border-line p-4">
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="پیامت رو بنویس..."
              aria-label="متن پیام"
              className="w-full resize-none rounded-xl border border-line bg-bg px-4 py-3 outline-none transition-colors focus:border-primary"
            />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <ImagePicker images={images} onChange={setImages} />
              <button
                type="submit"
                disabled={!canSend}
                className="flex items-center gap-2 rounded-xl bg-btn px-5 py-2.5 font-bold text-white transition-colors enabled:hover:bg-btn-hover enabled:active:bg-btn-active disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
              >
                <Send size={18} className="-scale-x-100" />
                ارسال
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
