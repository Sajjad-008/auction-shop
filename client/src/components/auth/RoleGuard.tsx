import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import useAppContext from "../../hooks/useAppContext";
import type { Role } from "../../types";

interface Props {
  role: Role;
  guestOk?: boolean;
  children: ReactNode;
}

const labels: Record<Role, string> = { buyer: "خریدار", seller: "فروشنده" };

export default function RoleGuard({ role, guestOk = false, children }: Props) {
  const { user } = useAppContext();
  const { pathname } = useLocation();

  if (!user) {
    if (guestOk) return <>{children}</>;
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  if (user.role === role) return <>{children}</>;

  const home = user.role === "seller" ? "/seller" : "/auctions";
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface py-16 text-center">
      <ShieldAlert size={40} className="text-muted" />
      <p className="text-muted">این بخش مخصوص حساب {labels[role]} است.</p>
      <Link to={home} className="font-bold text-primary hover:underline">
        بازگشت به پنل خودت
      </Link>
    </div>
  );
}
