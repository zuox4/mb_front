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
      <div className="hidden lg:flex lg:bg-sch-blue-dark lg:rounded-lg p-1 space-x-1">
        {filteredNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActiveLink(item.to)
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Мобильная версия */}
      {filteredNavItems.length > 1 && (
        <div className="fixed bottom-4 w-fit  left-1/2 transform -translate-x-1/2 lg:hidden z-50">
          <div className="bg-white/20 backdrop-blur-md flex justify-between rounded-2xl p-2 border border-white/30">
            <div className="flex justify-center w-full items-center space-x-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`p-3 rounded-2xl transition-all duration-200 ${
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
