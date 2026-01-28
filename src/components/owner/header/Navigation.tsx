import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Trophy,
  Home,
  User,
  Settings,
  ChevronRight,
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Зачетная книжка", icon: BookOpen },
    { path: "/events", label: "Мероприятия нашей школы", icon: CalendarDays },
    { path: "/achievements", label: "История достижений", icon: Trophy },
    { path: "/profile", label: "Мой профиль", icon: User },
    { path: "/settings", label: "Настройки", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full md:bg-white rounded-xl mt-5 ">
      {/* Заголовок */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 md:bg-blue-100 rounded-lg">
            <Home className="w-5 h-5 md:text-blue-600 text-white" />
          </div>
          <h3 className="text-lg font-semibold md:text-gray-800 text-white">
            Навигация
          </h3>
        </div>
        <p className="md:text-gray-600 text-gray-200 text-sm mt-1 ml-11">
          Выберите раздел
        </p>
      </div>

      {/* Список навигации */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center justify-between p-3 rounded-lg transition-colors ${
                active
                  ? "md:bg-blue-50 bg-blue-900/30 md:text-blue-700 text-white md:border md:border-blue-100 border border-blue-500/30"
                  : "md:text-gray-700 text-white md:hover:bg-gray-50 hover:bg-white/10 md:hover:text-gray-900 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-md ${
                    active
                      ? "md:bg-blue-100 bg-blue-600 md:text-blue-600 text-white"
                      : "md:text-gray-500 text-white/80 md:group-hover:text-gray-700 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="font-medium">{item.label}</span>
              </div>

              {active ? (
                <ChevronRight className="w-4 h-4 md:text-blue-500 text-blue-300" />
              ) : (
                <div className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 md:text-gray-400 text-gray-300" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
