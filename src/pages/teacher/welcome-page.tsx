import { teacherNavItems } from "@/config/teacherNavigation";
import { useAuth } from "@/hooks/auth";
import { useUserData } from "@/hooks/user/useUserData";

import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data } = useUserData(user?.id);

  const hasPoffice = data?.has_p_office;
  const hasEventTypes = data?.has_event_types;
  const hasGroupsLeader = data?.has_groups_leader;
  const hasAdmin = data?.has_admin;

  // Функция для проверки доступа к карточке
  const hasAccessToCard = (requiredRole: string) => {
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
        return true; // Если роль не указана, доступ разрешен
    }
  };
  const filteredNavItems = teacherNavItems.filter((item) => item.to !== "");
  return (
    <div className="mx-auto min-h-screen space-y-4 font-codec-news">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 uppercase">
          {user?.display_name}
        </h1>
        <p className="text-2xl md:text-4xl text-sch-green-light">
          Добро пожаловать в систему учета достижений
        </p>
      </div>

      {/* Основная информация о системе */}
      <div className="rounded-2xl">
        <h2 className=" text-lg md:text-xl font-semibold uppercase text-white mb-3">
          О платформе
        </h2>
        <div className="prose prose-lg max-w-none text-white uppercase space-y-4">
          <p className="text-lg md:text-xl leading-relaxed">
            Это приложение предназначено для администрирования результатами
            учеников 10-11 класса в мероприятиях{" "}
            <strong className="text-sch-green-light">
              Школы 1298 «Профиль Куркино»
            </strong>
            . Платформа обеспечивает комплексный учет и мониторинг
            образовательных достижений.
          </p>
        </div>
      </div>

      {/* Быстрая навигация */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {filteredNavItems.map((card, index) => {
          const hasAccess = hasAccessToCard(card.requiredRole || "");

          return (
            <div
              key={index}
              onClick={() => hasAccess && navigate(card.to)}
              className={`
                hidden
                p-6 rounded-xl border-2
                transition-all duration-300 transform backdrop-blur-sm
                group
                ${
                  hasAccess
                    ? `cursor-pointer md:block hover:scale-105 hover:bg-sch-blue-ultra/50 hover:shadow-lg border-sch-green-light`
                    : `hidden`
                }
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className={`text-lg font-bold mb-1 text-white`}>
                  {card.label}
                </h3>
                <p className="text-white text-sm opacity-80">
                  {card.description}
                </p>
                <div className="mt-3 text-white text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                  {hasAccess ? "Нажмите для перехода" : "Доступ ограничен"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WelcomePage;
