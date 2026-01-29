import { Link, useLocation } from "react-router-dom";
import { BookOpen, CalendarDays, Trophy, Home, User } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/student", label: "Главная", icon: Home },
    { path: "/student/markBook", label: "Зачетка", icon: BookOpen },
    { path: "/student/all-events", label: "Мероприятия", icon: CalendarDays },
    { path: "/student/achievements", label: "Результаты", icon: Trophy },
    { path: "/student/profile", label: "Профиль", icon: User },
  ];

  const isActive = (path: string) => {
    // Для главной страницы точное совпадение
    if (path === "/student") {
      return location.pathname === "/student";
    }
    // Для остальных страниц проверяем, начинается ли путь
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      {/* Контейнер с эффектом стекла */}
      <div className="relative overflow-hidden">
        {/* Основной фон с блюром */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-xl shadow-black/5" />

        {/* Градиентная обводка */}
        <div className="absolute inset-0 rounded-3xl border border-white/30" />

        {/* Внутренняя тень для объема */}
        <div className="absolute inset-0 rounded-3xl shadow-inner shadow-white/50" />

        {/* Навбар */}
        <nav className="relative flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 min-w-0 py-1"
              >
                <div className="relative mb-1">
                  {/* Подсветка для активного элемента */}

                  {/* Иконка */}
                  <div
                    className={`relative z-10 p-1 rounded-2xl transition-all duration-300 ${
                      active ? "" : ""
                    } backdrop-blur-md hover:bg-white/30`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        active ? "text-sch-green-light" : "text-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Текст */}
                <span
                  className={`text-xs font-semibold transition-all duration-300 ${
                    active ? "text-sch-green-light" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Декоративная полоска снизу */}
        <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-blue-200/50 to-transparent rounded" />
      </div>
    </div>
  );
};

export default Navigation;
