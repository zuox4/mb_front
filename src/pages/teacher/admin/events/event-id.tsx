import api from "@/services/api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ChevronDown, ChevronUp } from "lucide-react";

// Типы данных
interface Achievement {
  id: number;
  student_id: number;
  student_name?: string;
  teacher_id: number;
  achieved_at?: string;
  proof_document_path?: string;
  student_data?: Record<string, any>;
}

interface StageStatistic {
  stage_id: number;
  title: string;
  order: number;
  achievement_count: number;
  achievements: Achievement[];
}

interface EventData {
  id: number;
  title: string;
  description?: string;
  academic_year: string;
  is_active: boolean;
  event_type_id: number;
  event_type_name: string;
  total_achievements: number;
  stage_statistics: StageStatistic[];
  unique_students_count: number;
  total_highschool_students: number;
  participation_rate: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    borderColor: string;
  }>;
}

interface BarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderRadius: number;
  }>;
}

// Регистрация компонентов Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const EventPageById: React.FC = () => {
  const [data, setData] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAllAchievements, setShowAllAchievements] = useState<{
    [key: number]: boolean;
  }>({});
  const [showStagesSection, setShowStagesSection] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.get<EventData>(`/events/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке мероприятия:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowAll = (stageId: number): void => {
    setShowAllAchievements((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const toggleStagesSection = (): void => {
    setShowStagesSection(!showStagesSection);
  };

  // Подготовка данных для круговой диаграммы
  const getPieChartData = (): ChartData | null => {
    if (!data || !data.stage_statistics) return null;

    const stages = data.stage_statistics;
    const totalAchievements = data.total_achievements || 1;

    return {
      labels: stages.map((stage) => stage.title),
      datasets: [
        {
          data: stages.map((stage) => stage.achievement_count),
          backgroundColor: [
            "#3B82F6", // blue-500
            "#10B981", // emerald-500
            "#8B5CF6", // violet-500
            "#F59E0B", // amber-500
            "#EF4444", // red-500
            "#06B6D4", // cyan-500
            "#F97316", // orange-500
            "#8B5CF6", // purple-500
            "#EC4899", // pink-500
            "#84CC16", // lime-500
          ],
          borderWidth: 1,
          borderColor: "#FFFFFF",
        },
      ],
    };
  };

  // Подготовка данных для столбчатой диаграммы
  const getBarChartData = (): BarChartData | null => {
    if (!data || !data.stage_statistics) return null;

    const stages = data.stage_statistics;
    const totalStudents = data.total_highschool_students || 1;

    return {
      labels: stages.map((stage) => stage.title),
      datasets: [
        {
          label: "Процент участия",
          data: stages.map((stage) =>
            Math.round((stage.achievement_count / totalStudents) * 100)
          ),
          backgroundColor: "#3B82F6",
          borderRadius: 4,
        },
      ],
    };
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.raw}% участников`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
        title: {
          display: true,
          text: "Процент участников",
        },
      },
      x: {
        title: {
          display: true,
          text: "Стадии мероприятия",
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных мероприятия...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Ошибка</h2>
          <p className="mt-2 text-gray-600">
            Не удалось загрузить данные мероприятия
          </p>
        </div>
      </div>
    );
  }

  const hasAchievements = data.total_achievements > 0;
  const hasParticipation = data.participation_rate > 0;
  const hasStageStatistics =
    data.stage_statistics && data.stage_statistics.length > 0;
  const showStatistics = hasAchievements || hasParticipation;

  return (
    <div className="min-h-screen ">
      {/* Белый заголовок */}
      <div className=" shadow-sm">
        <div className=" mx-auto">
          <h1 className="text-3xl text-white font-bold ">{data.title}</h1>
          {data.description && (
            <p className="text-gray-600 mt-2">{data.description}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-white">
                Учебный год: {data.academic_year}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {data.is_active ? "Активно" : "Завершено"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white">Тип: {data.event_type_name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto py-6">
        {/* Показываем статистику только если есть достижения или участие */}
        {showStatistics ? (
          <>
            {/* Карточки статистики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">
                  Всего достижений
                </h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {data.total_achievements}
                </div>
                <p className="text-xs text-gray-400 mt-1">за весь период</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">
                  Участников
                </h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {data.unique_students_count}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  получили достижения
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">
                  10-11 классы
                </h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {data.total_highschool_students || 0}
                </div>
                <p className="text-xs text-gray-400 mt-1">всего учеников</p>
              </div>

              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Охват</h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {data.participation_rate || 0}%
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.participation_rate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Диаграммы - показываем только если есть данные для них */}
            {hasStageStatistics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Круговая диаграмма */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Распределение достижений по стадиям
                  </h3>
                  <div className="h-64">
                    {getPieChartData() && (
                      <Pie data={getPieChartData()!} options={pieOptions} />
                    )}
                  </div>
                </div>

                {/* Столбчатая диаграмма */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Процент участия по стадиям
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    От общего количества учеников 10-11 классов
                  </p>
                  <div className="h-64">
                    {getBarChartData() && (
                      <Bar data={getBarChartData()!} options={barOptions} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Детали по стадиям - раскрывающийся блок */}
            {hasStageStatistics && (
              <div className="bg-white rounded-lg shadow border border-gray-200 mb-8">
                <button
                  onClick={toggleStagesSection}
                  className="w-full px-6 py-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Достижения по стадиям
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Всего стадий: {data.stage_statistics.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {showStagesSection ? "Скрыть" : "Показать"}
                    </span>
                    {showStagesSection ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {showStagesSection && (
                  <div className="divide-y divide-gray-200">
                    {data.stage_statistics.map((stage, index) => {
                      const showAll =
                        showAllAchievements[stage.stage_id] || false;
                      const achievementsToShow = showAll
                        ? stage.achievements
                        : stage.achievements.slice(0, 3);

                      const coveragePercentage =
                        data.total_highschool_students > 0
                          ? (stage.achievement_count /
                              data.total_highschool_students) *
                            100
                          : 0;

                      return (
                        <div key={stage.stage_id} className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                                  {index + 1}
                                </span>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900">
                                    {stage.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Порядок: {stage.order}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                {stage.achievement_count} достижений
                              </span>
                              <span className="text-xs text-gray-500">
                                {coveragePercentage.toFixed(1)}% охвата
                              </span>
                            </div>
                          </div>

                          {stage.achievements.length > 0 ? (
                            <>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ученик
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Статус
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {achievementsToShow.map((achievement) => (
                                      <tr
                                        key={achievement.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-4 py-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {achievement.student_name ||
                                              `Ученик #${achievement.student_id}`}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Получено
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {stage.achievements.length > 3 && (
                                <div className="mt-4 text-center">
                                  <button
                                    onClick={() =>
                                      toggleShowAll(stage.stage_id)
                                    }
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    {showAll
                                      ? "Скрыть"
                                      : `Показать все ${stage.achievements.length} записей`}
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                              <div className="text-gray-400 mb-2">
                                <svg
                                  className="w-12 h-12 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <p className="text-gray-500">
                                Пока нет достижений на этой стадии
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Если нет достижений и охват 0%, показываем только информационное сообщение
          <div className="bg-white rounded-lg shadow p-8 border border-gray-200 mb-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Пока нет статистики по мероприятию
            </h3>
            <p className="text-gray-600">
              Достижения ещё не получены. Как только ученики начнут участвовать,
              здесь появится статистика.
            </p>
          </div>
        )}

        {/* Итоговая статистика - показываем всегда */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {showStatistics ? "Итоги мероприятия" : "Информация о мероприятии"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {data.total_achievements}
              </div>
              <p className="text-sm text-gray-600 mt-1">Всего достижений</p>
              <p className="text-xs text-gray-400">
                за весь период мероприятия
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {data.unique_students_count}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Уникальных участников
              </p>
              <p className="text-xs text-gray-400">
                получили хотя бы одно достижение
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {data.participation_rate || 0}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Общий охват</p>
              <p className="text-xs text-gray-400">
                от всех учеников 10-11 классов
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-sm text-gray-600 text-center">
              Учебный год: {data.academic_year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPageById;
