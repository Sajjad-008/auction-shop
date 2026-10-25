import type { TicketStatus } from "../types";

const meta: Record<TicketStatus, { label: string; cls: string }> = {
  open: { label: "در انتظار پاسخ", cls: "bg-warning-soft text-warning" },
  answered: { label: "پاسخ داده شد", cls: "bg-success-soft text-success" },
  closed: { label: "بسته شده", cls: "bg-line text-muted" },
};

export default function TicketStatusBadge({
  status,
}: {
  status: TicketStatus;
}) {
  const m = meta[status];
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${m.cls}`}
    >
      {m.label}
    </span>
  );
}
