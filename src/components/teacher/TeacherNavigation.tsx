// pages/teacher/components/TeacherNavigation.tsx
import { teacherNavItems } from "@/config/teacherNavigation";
import { useAuth } from "@/hooks/auth";
import { useUserData } from "@/hooks/user/useUserData";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface TeacherNavigationProps {
  hasPoffice?: boolean;
  hasEventTypes?: boolean;
  hasGroupsLeader?: boolean;
  hasAdmin?: boolean;
}

const TeacherNavigation: React.FC<TeacherNavigationProps> = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { data } = useUserData(user?.id);

  const hasPoffice = data?.has_p_office;
  const hasEventTypes = data?.has_event_types;
  const hasGroupsLeader = data?.has_groups_leader;
  const hasAdmin = data?.has_admin;

  const isActiveLink = (path: string) => {
    if (path === "") {
      return location.pathname === "/teacher";
    }
    return location.pathname.includes(path);
  };

  const hasAccessToItem = (requiredRole?: string) => {
    if (!requiredRole) return true;

    switch (requiredRole) {
      case "project_leader":
        return hasPoffice;
      case "event_leader":
        return hasEventTypes;
      case "group_leader":
        return hasGroupsLeader;
      case "admin":
        return hasAdmin;
      default:
        return true;
    }
  };

  // Фильтруем элементы меню по правам доступа
  const filteredNavItems = teacherNavItems.filter((item) =>
    hasAccessToItem(item.requiredRole)
  );

  return (
    <>
      {/* Десктопная версия */}
      <div className="hidden lg:block p-6 bg-gradient-to-br from-sch-blue-dark/30 to-sch-green-light/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-sch-green-light to-emerald-400">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Роли и доступы
          </h1>
        </div>

        <div className="flex gap-3">
          {filteredNavItems.map((item) => {
            const isActive = isActiveLink(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
            relative group overflow-hidden rounded-xl p-4 transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-sch-green-light/90 to-emerald-500/90 text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/5"
            }
          `}
              >
                {/* Фоновый эффект при наведении */}
                <div
                  className={`
            absolute inset-0 bg-gradient-to-r from-sch-green-light/0 to-emerald-400/0
            transition-opacity duration-300
            ${isActive ? "opacity-30" : "opacity-0 group-hover:opacity-10"}
          `}
                />

                {/* Контент */}
                <div className="relative flex items-center gap-3">
                  {/* Иконка если есть */}
                  {item.icon && (
                    <div
                      className={`
                p-2 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-white/20"
                    : "bg-white/10 group-hover:bg-white/15"
                }
              `}
                    >
                      {item.icon}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm block truncate">
                      {item.label}
                    </span>
                    {item.description && (
                      <p className="text-xs text-white/60 mt-1 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Индикатор активного состояния */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Мобильная версия */}
      {filteredNavItems.length > 1 && (
        <div className="fixed bottom-4 w-80  left-1/2 transform -translate-x-1/2 lg:hidden z-50">
          <div className="bg-white/20 backdrop-blur-md flex justify-between rounded-2xl p-2 ">
            <div className="flex justify-center w-full items-center space-x-7">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`p-2 rounded-2xl transition-all duration-200 ${
                    isActiveLink(item.to)
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-white hover:bg-white/20"
                  }`}
                  title={item.label} // Добавляем tooltip для иконок
                >
                  {/* Иконки для мобильной версии */}
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon ? (
                      item.icon
                    ) : (
                      // Заглушка для элементов без иконки
                      <div className="w-2 h-2 bg-current rounded-full" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherNavigation;
