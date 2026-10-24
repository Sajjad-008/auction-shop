import { X } from "lucide-react";
import { typeMeta } from "../utils/notificationTypes";
import { timeAgo } from "../utils/auction";

export default function NotificationItem({ n, onOpen, onRemove }) {
  const meta = typeMeta[n.type] ?? typeMeta.system;
  const Icon = meta.icon;

  return (
    <div
      className={`flex items-start gap-1 rounded-xl p-2 transition-colors hover:bg-hover ${
        n.read ? "" : "bg-primary-soft/40"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(n)}
        className="flex min-w-0 flex-1 items-start gap-3 rounded-lg p-1 text-right"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.box}`}
        >
          <Icon size={20} />
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="flex items-center gap-2">
            <span className={`text-sm ${n.read ? "font-medium" : "font-bold"}`}>
              {n.title}
            </span>
            {!n.read && (
              <span
                className="h-2 w-2 rounded-full bg-danger"
                aria-label="خوانده‌نشده"
              />
            )}
          </span>
          <span className="block text-sm text-muted">{n.text}</span>
          <span className="block text-xs text-muted">{timeAgo(n.at)}</span>
        </span>
      </button>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(n.id)}
          aria-label="حذف اعلان"
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-hover hover:text-danger active:bg-danger-soft"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
