import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAppContext from "../../hooks/useAppContext";
import Forbidden from "./Forbidden";
import type { Role } from "../../types";

interface Props {
  role: Role;
  guestOk?: boolean;
  children: ReactNode;
}

export default function RoleGuard({ role, guestOk = false, children }: Props) {
  const { user } = useAppContext();
  const { pathname } = useLocation();

  if (!user) {
    if (guestOk) return <>{children}</>;
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  if (user.role === role) return <>{children}</>;

  return <Forbidden requiredRole={role} currentRole={user.role} />;
}
