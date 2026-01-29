import { useState } from "react";
import {
  Trophy,
  Calendar,
  User,
  Award,
  TrendingUp,
  Filter,
} from "lucide-react";

interface Achievement {
  id: number;
  eventName: string;
  stage: string;
  result: string;
  teacher: string;
  date: string;
  points: number;
  isProfile: boolean;
}

const AchievementsPage = () => {
  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      eventName: "Олимпиада по математике",
      stage: "Муниципальный этап",
      result: "1 место",
      teacher: "Иванова М.П.",
      date: "2024-11-15",
      points: 150,
      isProfile: true,
    },
    {
      id: 2,
      eventName: "Соревнования по баскетболу",
      stage: "Финальный тур",
      result: "2 место",
      teacher: "Петров С.В.",
      date: "2024-10-22",
      points: 120,
      isProfile: false,
    },
    {
      id: 3,
      eventName: "Конкурс научных проектов",
      stage: "Школьный этап",
      result: "Лучший проект",
      teacher: "Сидорова Е.Л.",
      date: "2024-09-30",
      points: 100,
      isProfile: true,
    },
    {
      id: 4,
      eventName: "Выставка художественных работ",
      stage: "Городской конкурс",
      result: "Диплом 1 степени",
      teacher: "Кузнецова А.И.",
      date: "2024-05-18",
      points: 80,
      isProfile: false,
    },
    {
      id: 5,
      eventName: "Волонтерская акция 'Чистый город'",
      stage: "Общегородской проект",
      result: "Активный участник",
      teacher: "Васильев Д.К.",
      date: "2024-04-12",
      points: 50,
      isProfile: false,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "profile" | "non-profile">(
    "all",
  );

  // Фильтрация достижений
  const filteredAchievements = achievements.filter((ach) => {
    if (filter === "profile") return ach.isProfile;
    if (filter === "non-profile") return !ach.isProfile;
    return true;
  });

  // Общая статистика (все достижения)
  const totalPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);
  const allCount = achievements.length;

  // Статистика для фильтрованных достижений (только для итогов)
  const filteredPoints = filteredAchievements.reduce(
    (sum, ach) => sum + ach.points,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b w-full ">
      <div className="mx-auto">
        {/* Заголовок и статистика */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Достижения</h1>
              <p className="text-white/60 text-sm">История ваших успехов</p>
            </div>
          </div>

          {/* Общая статистика (все достижения) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-white/60 text-xs">Всего достижений</div>
                  <div className="text-lg font-bold text-white">{allCount}</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-white/60 text-xs">Всего баллов</div>
                  <div className="text-lg font-bold text-white">
                    {totalPoints}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-white/60 text-xs">Средний балл</div>
                  <div className="text-lg font-bold text-white">
                    {averagePoints}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Фильтры */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Показать:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-white/20 text-white shadow-sm"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilter("profile")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "profile"
                    ? "bg-blue-500/20 text-blue-400 shadow-sm"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                Профильные
              </button>
              <button
                onClick={() => setFilter("non-profile")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "non-profile"
                    ? "bg-green-500/20 text-green-400 shadow-sm"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                Общие
              </button>
            </div>
          </div>
        </div>

        {/* Список достижений */}
        <div className="space-y-3">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/20 mb-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Достижений нет</h3>
              <p className="text-white/60 text-sm">
                {filter === "profile"
                  ? "У вас пока нет профильных достижений"
                  : "У вас пока нет общих достижений"}
              </p>
            </div>
          ) : (
            filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-medium">
                        {ach.eventName}
                      </h3>
                      {ach.isProfile && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                          профиль
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-white/60 space-y-2">
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {ach.stage}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {ach.result}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ach.teacher}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ach.date).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-xl font-bold text-sch-green-light">
                      +{ach.points}
                    </div>
                    <div className="text-xs text-white/40">баллов</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Итоги по фильтру */}
        {filteredAchievements.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-white/60 text-sm">
                {filter === "all"
                  ? `Все достижения: ${filteredAchievements.length}`
                  : filter === "profile"
                    ? `Профильные достижения: ${filteredAchievements.length}`
                    : `Общие достижения: ${filteredAchievements.length}`}
              </div>
              <div className="text-white font-medium">
                Итого баллов:{" "}
                <span className="text-yellow-400">{filteredPoints}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
