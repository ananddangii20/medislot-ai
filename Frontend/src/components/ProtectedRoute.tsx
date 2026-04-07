import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getUserRole, isAuthenticated } from "@/utils/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"patient" | "doctor">;
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = (getUserRole() || "patient") as "patient" | "doctor";
    if (!allowedRoles.includes(currentRole)) {
      return <Navigate to={currentRole === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"} replace />;
    }
  }

  return <>{children}</>;
}