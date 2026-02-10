import { useOffices } from "@/hooks/admin/useOffices";
import { STATIC_BASE_URL } from "@/services/api/api";
import { BookMarked, Loader, Users, Building2 } from "lucide-react";
import { useState } from "react";
import LeaderView from "./LeaderView";
import { useNavigate } from "react-router-dom";

const ProjectOfficesPage = () => {
  const { data, isLoading } = useOffices();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set(),
  );
  const navigate = useNavigate();

  const toggleDescription = (officeId: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(officeId)) {
      newExpanded.delete(officeId);
    } else {
      newExpanded.add(officeId);
    }
    setExpandedDescriptions(newExpanded);
  };

  // Генерируем статистику для офисов

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-sch-green-light animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen">
        <h1 className="text-white font-codec text-2xl mb-6">Проектные офисы</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-gray-400">
            <p className="text-lg">Нет данных о проектных офисах</p>
            <p className="text-sm mt-2">
              Информация будет доступна после добавления офисов
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-codec">
      {/* Заголовок и статистика */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-codec-news">
              Проектные офисы
            </h1>
            <p className="text-gray-400 mt-1">
              {data.length} проектных офисов • Управление проектными
              инициативами
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Building2 className="w-4 h-4" />
            <span>Школьные проектные центры</span>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {data.length}
                </div>
                <div className="text-sm text-gray-300">Проектных офисов</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список проектных офисов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((office) => {
          const isDescriptionExpanded = expandedDescriptions.has(office.id);
          const description = office.description || "Описание отсутствует";
          const shouldTruncate = description.length > 100;
          const displayDescription =
            shouldTruncate && !isDescriptionExpanded
              ? `${description.slice(0, 100)}...`
              : description;

          return (
            <div
              key={office.id}
              className="group cursor-pointer"
              onClick={() => navigate(`${office.id}`)}
            >
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 h-full">
                {/* Верхняя часть с лого и названием */}
                <div className="flex items-start gap-4 mb-4">
                  {office.logo_url ? (
                    <div className="flex-shrink-0 ">
                      <img
                        className="w-16 h-16 object-contain rounded-lg"
                        src={`${STATIC_BASE_URL}/${office.logo_url}`}
                        alt={`Логотип ${office.title || "проектного офиса"}`}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-sch-green-light/20 rounded-lg flex-shrink-0">
                      <Building2 className="w-8 h-8 text-sch-green-light" />
                    </div>
                  )}

                  <div className="flex-1 items-center">
                    <h3 className="text-lg font-bold text-white mb-1 font-codec-news">
                      {office.title}
                    </h3>

                    {/* Статистика офиса */}
                    {/* <div className="flex flex-wrap gap-3 mt-2"> */}
                    {/* <div className="flex items-center gap-1 text-sm">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">
                          {stats.activeProjects || 0}
                        </span>
                        <span className="text-gray-500 text-xs">активных</span>
                      </div> */}

                    {/* <div className="flex items-center gap-1 text-sm">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-gray-300">
                          {stats.completedProjects || 0}
                        </span>
                        <span className="text-gray-500 text-xs">завершено</span>
                      </div> */}

                    {/* <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-gray-300">
                          {stats.studentCount || 0}
                        </span>
                        <span className="text-gray-500 text-xs">
                          участников
                        </span>
                      </div> */}
                    {/* </div> */}
                  </div>
                </div>

                {/* Описание */}
                <div className="mb-4">
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {displayDescription}
                    {shouldTruncate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(office.id);
                        }}
                        className="ml-2 text-sch-green-light hover:text-sch-green-dark text-xs font-medium"
                      >
                        {isDescriptionExpanded ? "Свернуть" : "Подробнее"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Классы и руководитель */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Классы */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <BookMarked className="w-4 h-4" />
                      <span>Классы</span>
                    </div>
                    {office.accessible_classes &&
                    office.accessible_classes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {office.accessible_classes
                          .slice(0, 3)
                          .map((c, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 rounded text-xs text-white"
                            >
                              {c.name}
                            </span>
                          ))}
                        {office.accessible_classes.length > 3 && (
                          <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                            +{office.accessible_classes.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">Не указаны</p>
                    )}
                  </div>

                  {/* Руководитель */}
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Users className="w-4 h-4" />
                      <span>Руководитель</span>
                    </div>
                    {office.leader_uid ? (
                      <div className="text-white text-sm font-medium">
                        <LeaderView id={office.leader_uid} />
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">Не назначен</p>
                    )}
                  </div>
                </div>

                {/* Прогресс-бар активности */}
                {/* <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Участие</span>
                    <span className="text-gray-300">
                      {stats.participationRate || 0}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sch-green-light to-sch-green-dark rounded-full"
                      style={{ width: `${stats.participationRate || 0}%` }}
                    ></div>
                  </div>
                </div> */}

                {/* Кнопка перехода */}
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Управление проектами
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Подсказка */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Нажмите на проектный офис для просмотра подробной информации и
        управления проектами
      </div>
    </div>
  );
};

export default ProjectOfficesPage;
