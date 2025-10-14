import { useUserData } from "@/hooks/user/useUserData";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../owner/Loader";

interface ProtectedRouteProps {
  requiredRole?:
    | "student"
    | "teacher"
    | "project_leader"
    | "event_leader"
    | "class_leader"
    | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading, logout } = useAuthStore();
  const {
    data: userData,
    error,
    isLoading: userLoading,
  } = useUserData(user?.id);

  if (error) {
    logout();
  }
  if (isLoading || userLoading)
    return (
      <div className="min-h-screen">
        <Loader />
      </div>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Проверка базовых ролей (student/teacher)
  if (requiredRole && ["student", "teacher"].includes(requiredRole)) {
    if (!user?.roles?.includes(requiredRole)) {
      if (user?.roles?.includes("teacher")) {
        return <Navigate to="/teacher" replace />;
      }
      if (user?.roles?.includes("student")) {
        return <Navigate to="/student" replace />;
      }
      return <Navigate to="/welcome" replace />;
    }
  }

  // Проверка специфических прав для учителей
  if (user?.roles?.includes("teacher") && requiredRole) {
    switch (requiredRole) {
      case "project_leader":
        if (!userData?.has_p_office) {
          return <Navigate to="/teacher" replace />;
        }
        break;
      case "event_leader":
        if (!userData?.has_event_types) {
          return <Navigate to="/teacher" replace />;
        }
        break;
      case "class_leader":
        if (!userData?.has_groups_leader) {
          return <Navigate to="/teacher" replace />;
        }
        break;
      case "admin":
        // Добавьте свою логику для проверки админских прав
        if (!userData?.has_admin) {
          return <Navigate to="/teacher" replace />;
        }
        break;
    }
  }

  return <Outlet />;
};
