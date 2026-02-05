import ClassList from "@/components/teacher/class-teacher/ClassList";
import { useClassTeacherGroups } from "@/hooks/teacher/useClassTeacherGroups";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, School } from "lucide-react";

const MyClassPage = () => {
  const navigate = useNavigate();
  const { data: groups = [], isLoading, error } = useClassTeacherGroups();
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Автоматически выбираем первый класс при загрузке
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups, selectedGroup]);

  // Если нет классов, перенаправляем на главную
  if (!isLoading && groups.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div className="glass-effect rounded-xl p-6 text-center">
          <School className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Нет доступных классов
          </h3>
          <p className="text-white/60 mb-6">
            Вам не назначены классы для руководства
          </p>
          <button
            onClick={() => navigate("/teacher")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </button>
        </div>
      </div>
    );
  }

  const selectedGroupName = groups.find(
    (g: { id: number | null }) => g.id === selectedGroup,
  )?.name;

  return (
    <div className="space-y-4">
      {/* Заголовок и селектор класса */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-white font-codec-news text-2xl">
            Ученики класса
          </h1>
          <p className="text-sm text-white/60">
            Управление учениками и их аккаунтами
          </p>
        </div>

        {/* Селектор класса */}
        {groups.length > 0 && (
          <div className="relative">
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 z-50">
                  <div className="glass-effect rounded-lg border border-white/20 shadow-xl overflow-hidden">
                    {groups.map((group: { id: number; name: string }) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setSelectedGroup(group.id);
                          setDropdownOpen(false);
                        }}
                        className={`
                          w-full text-left px-4 py-3 text-sm transition-colors
                          flex items-center justify-between
                          hover:bg-white/10
                          ${
                            selectedGroup === group.id
                              ? "bg-blue-500/20 text-blue-300 font-medium"
                              : "text-white"
                          }
                        `}
                      >
                        <span>{group.name}</span>
                        {selectedGroup === group.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Статистика по классам */}
      {groups.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {groups.map((group: { id: number; name: string }) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`
                flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all
                ${
                  selectedGroup === group.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "glass-effect text-white/70 hover:text-white hover:bg-white/10"
                }
              `}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}

      {/* Информация о выбранном классе */}
      {selectedGroup && (
        <div className="glass-effect rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {selectedGroupName} класс
              </h2>
            </div>
            <div className="text-xs text-white/40">
              {groups.find((g: { id: number }) => g.id === selectedGroup)
                ?.students_count || 0}{" "}
              учеников
            </div>
          </div>

          <ClassList classId={selectedGroup} />
        </div>
      )}

      {/* Загрузка */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-white/60 mt-2">Загрузка классов...</p>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="glass-effect rounded-lg p-4 border border-red-500/30">
          <div className="text-red-300">
            Ошибка загрузки данных: {error.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClassPage;
