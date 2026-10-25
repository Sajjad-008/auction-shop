import type { MyStatus } from "../types";

const styles: Record<MyStatus, string> = {
  leading: "bg-success-soft text-success",
  outbid: "bg-warning-soft text-warning",
  won: "bg-primary-soft text-primary",
  lost: "bg-line text-muted",
};
const labels: Record<MyStatus, string> = {
  leading: "در صدر هستی",
  outbid: "پیشی گرفته شدی",
  won: "برنده شدی",
  lost: "برنده نشدی",
};

export default function StatusBadge({ status }: { status: MyStatus | null }) {
  if (!status) return null;
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
