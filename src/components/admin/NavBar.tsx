import { Calendar, Group, Landmark, List, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const navigation = [
    {
      path: "event-types",
      title: "Типы мероприятий",
      icon: <List size={20} />,
    },
    {
      path: "events",
      title: "Мероприятия",
      icon: <Calendar size={20} />,
    },
    {
      path: "project-offices",
      title: "Проектные оффисы",
      icon: <Landmark size={20} />,
    },
    {
      path: "groups",
      title: "Классы",
      icon: <Group size={20} />,
    },
  ];

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`
      bg-sch-graphite h-screen sticky top-0 flex flex-col
      transition-all duration-500 ease-in-out
      border-r-1 border-sch-green-light/20
      ${isOpen ? "min-w-64 max-w-64" : "min-w-16 max-w-16"}
    `}
    >
      {/* Заголовок */}
      <div className="flex items-center p-4 border-b border-white/20 h-16 shrink-0">
        {isOpen ? (
          <div className="flex items-center justify-between w-full">
            <h1 className="font-codec text-xl font-bold text-white">Меню</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white hover:bg-white/10 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="p-1 text-white hover:bg-white/10 rounded transition-colors w-full flex justify-center"
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Навигация */}
      <nav className="flex-1 p-2 space-y-1 overflow-hidden">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-all duration-300 group overflow-hidden ${
                isActive
                  ? "bg-sch-green-light text-white shadow-md"
                  : "text-white hover:bg-white/10"
              }`
            }
          >
            <span
              className={`shrink-0 transition-all duration-300 ${isOpen ? "mr-3" : "mx-auto"}`}
            >
              {item.icon}
            </span>
            <span
              className={`
              font-codec-news text-sm whitespace-nowrap transition-all duration-300
              ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 w-0"}
            `}
            >
              {item.title}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default NavBar;
