import { NavLink, Outlet } from "react-router-dom";
import { Users, Calendar, Settings, School, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useClassTeacherGroups } from "@/hooks/teacher/useClassTeacherGroups";

const ClassLeaderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    // {
    //   to: "dashboard",
    //   icon: <LayoutDashboard className="w-4 h-4" />,
    //   label: "Дашборд",
    // },
    {
      to: "event-dashboard",
      icon: <Calendar className="w-4 h-4" />,
      label: "Мероприятия",
    },
    {
      to: "my-class",
      icon: <Users className="w-4 h-4" />,
      label: "Мой класс",
    },
    {
      to: "school",
      icon: <School className="w-4 h-4" />,
      label: "Школа",
    },
    {
      to: "settings",
      icon: <Settings className="w-4 h-4" />,
      label: "Настройки",
    },
  ];
  const { data } = useClassTeacherGroups();
  console.log(data);

  return (
    <div className="flex min-h-screen bg-gradient-to-br ">
      <div
        className={`
          fixed lg:static top-0 left-0 h-screen
          backdrop-blur-xl backdrop-saturate-150 bg-white/10
          border-r border-white/20
          transition-all duration-300 z-40
          ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-16"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Заголовок */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <School className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && data && (
                <div>
                  <h1 className="text-lg font-bold text-white">Class Leader</h1>
                  <p className="text-xs text-white/60">Классный руководитель</p>
                  {/* Sidebar */}
                </div>
              )}
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex-1 p-3">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "dashboard"}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/25"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }
                      ${!sidebarOpen && "justify-center"}
                    `}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 pl-5">
        <div className=" mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay для мобильных */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ClassLeaderPage;
