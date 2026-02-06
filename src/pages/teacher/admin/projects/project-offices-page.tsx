import { useOffices } from "@/hooks/admin/useOffices";
import { STATIC_BASE_URL } from "@/services/api/api";
import { BookMarked, ChevronDown, ChevronUp, Loader } from "lucide-react";
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
    <div className="min-h-screen">
      <h1 className="text-white font-codec text-2xl mb-6">Проектные офисы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
              onClick={() => navigate(`${office.id}`)}
              className="flex flex-col gap-4 bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-5 border border-sch-green-light/30"
            >
              {/* Логотип */}
              <div className="flex justify-between items-center">
                {office.logo_url ? (
                  <img
                    className="w-40 h-20 object-contain"
                    src={`${STATIC_BASE_URL}/${office.logo_url}`}
                    alt={`Логотип ${office.title || "проектного офиса"}`}
                  />
                ) : (
                  <div className="w-40 h-20 flex items-center justify-center bg-sch-green-light/20 rounded-lg">
                    <span className="text-gray-400 text-sm">Нет логотипа</span>
                  </div>
                )}
                <div className="flex gap-2 hover:scale-105 items-center h-10 border p-2 rounded-xl border-sch-green-light cursor-pointer bg-sch-blue-dark/20">
                  <BookMarked color="white" />
                  <span className="font-codec-news text-[12px] text-gray-400 lg:text-white">
                    Cтатистика
                  </span>
                </div>
              </div>

              {/* Описание с раскрытием */}
              <div className="flex-1">
                <div className="text-white text-sm leading-relaxed">
                  {displayDescription}
                </div>
                {shouldTruncate && (
                  <button
                    onClick={() => toggleDescription(office.id)}
                    className="flex items-center gap-1 text-sch-green-light hover:text-sch-green-dark text-sm mt-2 transition-colors"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Свернуть
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Подробнее
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex justify-between">
                {/* Классы в проекте */}
                <div>
                  <h2 className="font-codec text-white mb-2">
                    Классы в проекте
                  </h2>
                  {office.accessible_classes &&
                  office.accessible_classes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {office.accessible_classes.map((c, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 hover:scale-105 cursor-pointer border border-sch-green-light/50 rounded-full text-white text-sm bg-sch-green-light/10"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Классы не указаны</p>
                  )}
                </div>

                {/* Руководитель */}
                <div>
                  <h2 className="font-codec text-white mb-2">Руководитель</h2>
                  {office.leader_uid ? (
                    <LeaderView id={office.leader_uid} />
                  ) : (
                    "Не назначен"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectOfficesPage;
