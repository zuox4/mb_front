import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState, useMemo } from "react";
import {
  ArrowUpDown,
  User,
  Award,
  Search,
  X,
  Star,
  StarOff,
} from "lucide-react";

interface PivotTableViewProps {
  students: PivotStudent[];
  onStudentClick: (student: PivotStudent) => void;
}

interface StudentEvent {
  event_name: string;
  total_score: number;
  is_important: boolean;
  completed_stages_count: number;
  min_stages_required: number;
  stages: Array<{
    name: string;
    current_score: number;
    status: string;
  }>;
}

type SortField = "name" | "totalScore" | "completedEvents";
type SortDirection = "asc" | "desc";
type EventStatus = "зачет" | "в процессе" | "не начато";

interface StudentMetrics {
  totalScore: number;
  completedEvents: number;
  importantScore: number;
  importantCompletedEvents: number;
}

interface StudentWithMetrics extends PivotStudent {
  metrics: StudentMetrics;
}

const PivotTableView: React.FC<PivotTableViewProps> = ({
  students,
  onStudentClick,
}) => {
  const [sortField, setSortField] = useState<SortField>("totalScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        Нет данных для отображения
      </div>
    );
  }

  // Получаем все мероприятия и фильтруем по важности
  const getAllEvents = () => {
    const allEvents = Object.entries(students[0]?.events || {});

    if (showImportantOnly) {
      return allEvents
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, event]) => (event as StudentEvent)?.is_important === true,
        )
        .map(([key]) => key);
    }

    return allEvents.map(([key]) => key);
  };

  const displayedEvents = getAllEvents();

  // Функция для получения статуса события
  const getEventStatus = (
    event: StudentEvent,
  ): { status: EventStatus; color: string } => {
    if (event.completed_stages_count >= event.min_stages_required) {
      return { status: "зачет", color: "bg-emerald-400 text-white" };
    } else if (event.total_score > 0) {
      return { status: "в процессе", color: "bg-amber-400 text-gray-900" };
    } else {
      return { status: "не начато", color: "bg-gray-300 text-gray-900" };
    }
  };

  // Вычисление метрик студента
  const getStudentMetrics = (student: PivotStudent): StudentMetrics => {
    const events = Object.values(student.events || {}) as StudentEvent[];

    const totalScore = events.reduce(
      (sum, event) => sum + (event.total_score || 0),
      0,
    );
    const completedEvents = events.filter(
      (e) => e.completed_stages_count >= e.min_stages_required,
    ).length;

    const importantEvents = events.filter((e) => e.is_important === true);
    const importantScore = importantEvents.reduce(
      (sum, event) => sum + (event.total_score || 0),
      0,
    );
    const importantCompletedEvents = importantEvents.filter(
      (e) => e.completed_stages_count >= e.min_stages_required,
    ).length;

    return {
      totalScore,
      completedEvents,
      importantScore: showImportantOnly ? importantScore : totalScore,
      importantCompletedEvents: showImportantOnly
        ? importantCompletedEvents
        : completedEvents,
    };
  };

  // Поиск студентов
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredAndSortedStudents = useMemo((): StudentWithMetrics[] => {
    const studentsWithMetrics: StudentWithMetrics[] = students.map(
      (student) => ({
        ...student,
        metrics: getStudentMetrics(student),
      }),
    );

    let filtered = studentsWithMetrics;
    if (searchTerm.trim() !== "") {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      filtered = studentsWithMetrics.filter((student) =>
        student.student_name.toLowerCase().includes(normalizedSearch),
      );
    }

    return [...filtered].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "name":
          aValue = a.student_name.toLowerCase();
          bValue = b.student_name.toLowerCase();
          break;
        case "totalScore":
          aValue = showImportantOnly
            ? a.metrics.importantScore
            : a.metrics.totalScore;
          bValue = showImportantOnly
            ? b.metrics.importantScore
            : b.metrics.totalScore;
          break;
        case "completedEvents":
          aValue = showImportantOnly
            ? a.metrics.importantCompletedEvents
            : a.metrics.completedEvents;
          bValue = showImportantOnly
            ? b.metrics.importantCompletedEvents
            : b.metrics.completedEvents;
          break;
        default:
          aValue = showImportantOnly
            ? a.metrics.importantScore
            : a.metrics.totalScore;
          bValue = showImportantOnly
            ? b.metrics.importantScore
            : b.metrics.totalScore;
      }

      if (aValue === bValue && sortField !== "name") {
        aValue = a.student_name.toLowerCase();
        bValue = b.student_name.toLowerCase();
      }

      const directionMultiplier = sortDirection === "asc" ? 1 : -1;

      if (aValue < bValue) return -1 * directionMultiplier;
      if (aValue > bValue) return 1 * directionMultiplier;
      return 0;
    });
  }, [students, searchTerm, sortField, sortDirection, showImportantOnly]);

  // Обработчик клика по сортировке
  const handleSortClick = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc");
    }
  };

  // Получение иконки сортировки
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpDown className="w-3 h-3 ml-1 rotate-180" />
    ) : (
      <ArrowUpDown className="w-3 h-3 ml-1" />
    );
  };

  // Очистка поиска
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Переключение поиска
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearchTerm("");
  };

  return (
    <div className="space-y-3">
      {/* Компактная панель управления */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white">
              Результаты учеников
            </h3>
            <p className="text-gray-300 text-xs mt-0.5">
              {filteredAndSortedStudents.length} из {students.length} учеников •{" "}
              {displayedEvents.length} {showImportantOnly ? "важных" : ""}{" "}
              мероприятий
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Кнопка фильтра важных */}
            <button
              onClick={() => setShowImportantOnly(!showImportantOnly)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                showImportantOnly
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10"
              }`}
            >
              {showImportantOnly ? (
                <>
                  <Star className="w-4 h-4" />
                  Важные
                </>
              ) : (
                <>
                  <StarOff className="w-4 h-4" />
                  Все
                </>
              )}
            </button>

            {/* Поиск */}
            {showSearch ? (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по фамилии..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-7 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : null}

            {/* Кнопка поиска */}
            <button
              onClick={toggleSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10 transition-colors"
            >
              {showSearch ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Сортировка - компактный вид */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { field: "name" as const, label: "Имя", icon: User },
            {
              field: "totalScore" as const,
              label: showImportantOnly ? "Балл важных" : "Общий балл",
              icon: Award,
            },
            {
              field: "completedEvents" as const,
              label: showImportantOnly ? "Зачтено важных" : "Зачтено",
              icon: Award,
            },
          ].map(({ field, label, icon: Icon }) => (
            <button
              key={field}
              onClick={() => handleSortClick(field)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors text-sm ${
                sortField === field
                  ? field === "name"
                    ? "bg-blue-400/30 text-blue-200 border border-blue-400/50"
                    : field === "totalScore"
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50"
                      : "bg-purple-500/30 text-purple-200 border border-purple-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {getSortIcon(field)}
            </button>
          ))}
        </div>

        {/* Информация о фильтре */}
        {showImportantOnly && (
          <div className="mt-2 px-2 py-1 bg-amber-500/10 text-amber-300 rounded-lg text-xs flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Показаны только важные мероприятия
          </div>
        )}
      </div>

      {/* Компактная таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-white/10">
              <th className="px-3 py-2 text-center text-white font-medium border-r border-white/10 w-12">
                №
              </th>
              <th className="px-3 py-2 text-left text-white font-medium border-r border-white/10 min-w-[90px]  sticky left-0 bg-sch-blue-dark/10">
                Ученик
              </th>
              <th className="px-3 py-2 text-left text-white font-medium border-r border-white/10 min-w-[70px]">
                Класс
              </th>
              <th className="px-3 py-2 text-center text-white font-medium border-r border-white/10 min-w-[80px]">
                {showImportantOnly ? "Балл важных" : "Балл"}
              </th>
              <th className="px-3 py-2 text-center text-white font-medium border-r border-white/10 min-w-[80px]">
                {showImportantOnly ? "Зачтено важных" : "Зачтено"}
              </th>
              {displayedEvents.map((eventId) => {
                const event = students[0]?.events[eventId] as StudentEvent;
                return (
                  <th
                    key={eventId}
                    className="p-0 border-r border-white/10 min-w-[50px] align-bottom"
                    title={event?.event_name}
                  >
                    <div className="h-[200px] flex flex-col items-center justify-center gap-1 relative">
                      {/* Текст вертикально */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                          className="transform -rotate-90 whitespace-nowrap text-xs font-medium text-white
                     max-w-[150px] truncate"
                        >
                          {event?.event_name}
                        </div>
                      </div>

                      {/* Звездочка внизу */}
                      {event?.is_important && (
                        <div className="absolute bottom-2">
                          <Star className="w-3 h-3 text-amber-400" />
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={5 + displayedEvents.length}
                  className="px-4 py-6 text-center"
                >
                  <div className="text-gray-400">
                    {searchTerm ? "Ученики не найдены" : "Нет данных"}
                  </div>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-2 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Очистить поиск
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredAndSortedStudents.map((student, index) => {
                const displayScore = showImportantOnly
                  ? student.metrics.importantScore
                  : student.metrics.totalScore;
                const displayCompleted = showImportantOnly
                  ? student.metrics.importantCompletedEvents
                  : student.metrics.completedEvents;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => onStudentClick(student)}
                  >
                    <td className="px-3 py-2 text-center border-r border-white/10 text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 border-r border-white/10 text-white sticky left-0 bg-sch-blue-dark/10">
                      <div className="flex flex-col">
                        <div className="font-medium truncate">
                          {student.student_name}
                        </div>
                        {student.class_teacher && (
                          <div className="text-xs text-gray-300 truncate">
                            {student.class_teacher}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-white/10 text-blue-300">
                      {student.group_name}
                    </td>
                    <td className="px-3 py-2 border-r border-white/10 text-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`text-base font-bold ${
                            displayScore >= 80
                              ? "text-emerald-400"
                              : displayScore >= 60
                                ? "text-green-400"
                                : displayScore >= 40
                                  ? "text-yellow-400"
                                  : "text-red-400"
                          }`}
                        >
                          {displayScore}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-r border-white/10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-semibold text-white">
                          {displayCompleted}
                          <span className="text-xs text-gray-400 ml-1">
                            /{displayedEvents.length}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {displayedEvents.length > 0
                            ? `${Math.round((displayCompleted / displayedEvents.length) * 100)}%`
                            : "0%"}
                        </div>
                      </div>
                    </td>

                    {/* Результаты по мероприятиям - компактный вид */}
                    {displayedEvents.map((eventId) => {
                      const event = student.events[eventId] as
                        | StudentEvent
                        | undefined;

                      if (!event) {
                        return (
                          <td
                            key={eventId}
                            className="px-2 py-2 text-center border-r border-white/10"
                          >
                            <div className="text-gray-400 text-xs">—</div>
                          </td>
                        );
                      }

                      const statusInfo = getEventStatus(event);

                      return (
                        <td
                          key={eventId}
                          className="px-2 py-2 text-center border-r border-white/10 group relative"
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            {/* Иконка важности */}
                            {/* {event.is_important && (
                              <div className="absolute -top-1 -right-1">
                                <Star className="w-2.5 h-2.5 text-amber-400" />
                              </div>
                            )} */}

                            {/* Статус */}
                            <div
                              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                            >
                              {statusInfo.status.charAt(0)}
                            </div>

                            {/* Прогресс */}
                            <div className="text-xs text-gray-300">
                              {event.completed_stages_count}/
                              {event.min_stages_required}
                            </div>

                            {/* Баллы */}
                            <div className="text-xs font-bold text-emerald-400">
                              {event.total_score || 0}б
                            </div>
                          </div>

                          {/* Тулкит при наведении */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 bg-gray-800/95 border border-white/20 rounded-lg p-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 shadow-lg backdrop-blur-sm">
                            <div className="text-xs transform font-semibold text-white mb-1.5 pb-1 border-b border-white/10">
                              {event.event_name}
                            </div>
                            <div className="space-y-1">
                              {event.stages
                                .slice(0, 3)
                                .map((stage, stageIndex) => (
                                  <div
                                    key={stageIndex}
                                    className="flex justify-between items-center text-xs"
                                  >
                                    <span className="text-gray-200 truncate mr-2">
                                      {stage.name}
                                    </span>
                                    <span
                                      className={`font-medium px-1.5 py-0.5 rounded ${
                                        stage.status === "зачет"
                                          ? "bg-emerald-500/30 text-emerald-300"
                                          : "bg-red-500/30 text-red-300"
                                      }`}
                                    >
                                      {stage.current_score}б
                                    </span>
                                  </div>
                                ))}
                              {event.stages.length > 3 && (
                                <div className="text-xs text-gray-400 text-center pt-1 border-t border-white/10">
                                  +{event.stages.length - 3} этапов
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PivotTableView;
