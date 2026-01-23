import { Calendar, Group, Landmark, List, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigation = [
    // {
    //   path: "/",
    //   title: "Главная",
    //   icon: <Home size={22} />,
    // },
    {
      path: "event-types",
      title: "Типы мероприятий",
      icon: <List size={22} />,
    },
    {
      path: "events",
      title: "Мероприятия",
      icon: <Calendar size={22} />,
    },
    {
      path: "project-offices",
      title: "Проектные офисы",
      icon: <Landmark size={22} />,
    },
    {
      path: "groups",
      title: "Классы",
      icon: <Group size={22} />,
    },
  ];

  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`
      relative h-screen top-0 flex flex-col
      transition-all duration-300 ease-out
      ${isOpen ? "min-w-80 max-w-80" : "min-w-20 max-w-20"}
    `}
    >
      {/* Основной контент */}
      <div
        className={`
        flex-1 flex flex-col
        bg-white/5 backdrop-blur-md
        border-r border-white/10
        transition-all duration-300
      `}
      >
        {/* Заголовок */}
        <div className="flex items-center p-6 h-20 shrink-0">
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Menu size={22} className="text-white" />
                </div>
                <h1 className="text-xl font-semibold text-white">Навигация</h1>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={22} className="text-white/70" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors mx-auto"
            >
              <Menu size={22} className="text-white/70" />
            </button>
          )}
        </div>

        {/* Навигация */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              location.pathname.includes(item.path) && item.path !== "/";
            const isHomeActive = item.path === "/" && location.pathname === "/";

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: navIsActive }) => `
                  relative flex items-center w-full p-4 rounded-2xl transition-all duration-300 group
                  ${
                    isActive || isHomeActive || navIsActive
                      ? "bg-gradient-to-r from-white/15 to-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                  ${isOpen ? "gap-4" : "justify-center"}
                `}
              >
                {/* Иконка */}
                <div
                  className={`
                  transition-transform duration-300
                  ${isActive || isHomeActive ? "scale-110" : ""}
                `}
                >
                  {item.icon}
                </div>

                {/* Текст */}
                <span
                  className={`
                    font-medium transition-all duration-300 whitespace-nowrap
                    ${
                      isOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4 w-0"
                    }
                  `}
                >
                  {item.title}
                </span>

                {/* Акцентная точка справа */}
                {(isActive || isHomeActive) && isOpen && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
