import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState, useMemo } from "react";
import { ArrowUpDown, User, Award, Search, X } from "lucide-react";

interface PivotTableViewProps {
  students: PivotStudent[];
  onStudentClick: (student: PivotStudent) => void;
}

// Типы для событий студента
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

// Типы для сортировки
type SortField = "name" | "totalScore" | "completedEvents";
type SortDirection = "asc" | "desc";

// Тип для статуса события
type EventStatus = "зачет" | "в процессе" | "не начато";

// Интерфейс для метрик студента
interface StudentMetrics {
  totalScore: number;
  completedEvents: number;
}

// Интерфейс для статуса события с цветом
interface EventStatusInfo {
  status: EventStatus;
  color: string;
}

// Типизированный интерфейс для студента с метриками
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

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Нет данных для отображения
      </div>
    );
  }

  // Получаем все мероприятия из данных первого студента
  const allEvents = Object.keys(students[0]?.events || {}) as string[];

  // Функция для получения статуса события
  const getEventStatus = (event: StudentEvent): EventStatusInfo => {
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
      0
    );
    const completedEvents = events.filter(
      (e) => e.completed_stages_count >= e.min_stages_required
    ).length;

    return { totalScore, completedEvents };
  };

  // Функция для нормализации имени (удаление лишних пробелов, приведение к нижнему регистру)
  const normalizeName = (name: string): string => {
    return name.toLowerCase().trim();
  };

  // Поиск студентов по фамилии/имени
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredAndSortedStudents = useMemo((): StudentWithMetrics[] => {
    // Добавляем метрики к каждому студенту
    const studentsWithMetrics: StudentWithMetrics[] = students.map(
      (student) => ({
        ...student,
        metrics: getStudentMetrics(student),
      })
    );

    // Фильтрация по поисковому запросу
    let filtered = studentsWithMetrics;
    if (searchTerm.trim() !== "") {
      const normalizedSearch = normalizeName(searchTerm);
      filtered = studentsWithMetrics.filter((student) =>
        normalizeName(student.student_name).includes(normalizedSearch)
      );
    }

    // Сортируем студентов
    return [...filtered].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case "name":
          aValue = normalizeName(a.student_name);
          bValue = normalizeName(b.student_name);
          break;
        case "totalScore":
          aValue = a.metrics.totalScore;
          bValue = b.metrics.totalScore;
          break;
        case "completedEvents":
          aValue = a.metrics.completedEvents;
          bValue = b.metrics.completedEvents;
          break;
        default:
          aValue = a.metrics.totalScore;
          bValue = b.metrics.totalScore;
      }

      // Вторичная сортировка по имени для равных значений (кроме сортировки по имени)
      if (aValue === bValue && sortField !== "name") {
        aValue = normalizeName(a.student_name);
        bValue = normalizeName(b.student_name);
      }

      const directionMultiplier = sortDirection === "asc" ? 1 : -1;

      if (aValue < bValue) return -1 * directionMultiplier;
      if (aValue > bValue) return 1 * directionMultiplier;
      return 0;
    });
  }, [students, searchTerm, sortField, sortDirection]);

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
  const getSortIcon = (field: SortField): React.ReactNode => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpDown className="w-3 h-3 ml-1 rotate-180" />
    ) : (
      <ArrowUpDown className="w-3 h-3 ml-1" />
    );
  };

  // Получение цвета для баллов в зависимости от позиции
  const getScoreColor = (score: number): string => {
    if (sortField !== "totalScore") return "text-emerald-500";

    // Находим максимальный балл для градиента
    const maxScore = Math.max(
      ...filteredAndSortedStudents.map((s) => s.metrics.totalScore)
    );
    if (maxScore === 0) return "text-emerald-500";

    // Высокий балл - зеленый, средний - желтый, низкий - серый
    const ratio = score / maxScore;
    if (ratio > 0.7) return "text-emerald-500";
    if (ratio > 0.4) return "text-amber-500";
    return "text-gray-500";
  };

  // Очистка поиска
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      {/* Панель управления */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Результаты учеников
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              {filteredAndSortedStudents.length} из {students.length} учеников •{" "}
              {allEvents.length} мероприятий
              {searchTerm && (
                <span className="ml-2 text-emerald-300">
                  • Поиск: "{searchTerm}"
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Поиск по фамилии */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по фамилии..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Кнопки сортировки */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { field: "name" as const, label: "Имя", icon: User },
                  {
                    field: "totalScore" as const,
                    label: "Общий балл",
                    icon: Award,
                  },
                  {
                    field: "completedEvents" as const,
                    label: "Зачтено",
                    icon: Award,
                  },
                ] as const
              ).map(({ field, label, icon: Icon }) => (
                <button
                  key={field}
                  onClick={() => handleSortClick(field)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    sortField === field
                      ? field === "name"
                        ? "bg-blue-400/30 text-blue-200 border border-blue-400/50"
                        : field === "totalScore"
                          ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50"
                          : "bg-purple-500/30 text-purple-200 border border-purple-500/50"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{label}</span>
                  {getSortIcon(field)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Информация о текущей сортировке */}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className="text-gray-300">
            Сортировка:{" "}
            <span className="text-white font-medium">
              {sortField === "name"
                ? "по имени"
                : sortField === "totalScore"
                  ? "по общему баллу"
                  : "по количеству зачтенных мероприятий"}
            </span>
            <span className="text-gray-400 ml-1">
              ({sortDirection === "asc" ? "А→Я" : "Я→А"})
            </span>
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/10">
              {/* Порядковый номер - фиксированная колонка */}
              <th className="px-4 py-3 text-left text-sm font-medium text-white border-r bg-sch-blue-dark/10 border-white/10 sticky left-0 z-30 min-w-[50px] ">
                №
              </th>

              {/* ФИО - фиксированная колонка */}
              <th className="px-4 py-3 text-left text-sm font-medium text-white border-r bg-sch-blue-dark/10 border-white/10 sticky left-[50px] z-30 min-w-[200px] ">
                Ученик
              </th>

              {/* Класс - фиксированная колонка */}
              <th className="px-4 py-3 text-left text-sm font-medium text-white border-r bg-sch-blue-dark/10 border-white/10 sticky left-[350px] z-30 ">
                Класс
              </th>

              {/* Остальные колонки */}
              <th className="px-4 py-3 text-center text-sm font-medium text-white border-r border-white/10">
                Общий балл
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-white border-r border-white/10">
                Зачтено
              </th>
              {allEvents.map((eventId) => {
                const event = students[0]?.events[eventId];
                return (
                  <th
                    key={eventId}
                    className="px-3 py-3 text-center text-sm font-medium text-white border-r border-white/10 min-w-[180px]"
                  >
                    <div className="font-medium">{event?.event_name}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={5 + allEvents.length}
                  className="px-4 py-8 text-center"
                >
                  <div className="text-gray-400">
                    {searchTerm ? "Ученики не найдены" : "Нет данных"}
                  </div>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="mt-2 text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      Очистить поиск
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredAndSortedStudents.map((student, index) => {
                const { totalScore, completedEvents } = student.metrics;

                // Определяем цвет для номера строки
                const getRowNumberColor = () => {
                  if (sortField === "totalScore") {
                    if (index === 0) return "text-yellow-400";
                    if (index === 1) return "text-gray-300";
                    if (index === 2) return "text-amber-400";
                  }
                  return "text-gray-400";
                };

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-white/10 cursor-pointer transition-colors ${
                      sortField === "totalScore" && index < 3
                        ? "border-l-2 border-emerald-500/50"
                        : ""
                    }`}
                    onClick={() => onStudentClick(student)}
                  >
                    {/* Порядковый номер - фиксированная колонка */}
                    <td
                      className={`px-4 py-3 text-center border-r bg-sch-blue-dark/10 border-white/10 sticky left-0 z-20`}
                    >
                      <div className={`font-bold ${getRowNumberColor()}`}>
                        {index + 1}
                      </div>
                    </td>

                    {/* ФИО - фиксированная колонка */}
                    <td
                      className={`px-4 py-3 text-white border-r bg-sch-blue-dark/10 border-white/10 sticky left-[50px] z-20 min-w-[200px]`}
                    >
                      <div className="flex flex-col">
                        <div className="font-semibold truncate">
                          {student.student_name}
                        </div>
                        {student.class_teacher && (
                          <div className="text-xs text-gray-300 truncate mt-1">
                            Классный руководитель: {student.class_teacher}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Класс - фиксированная колонка */}
                    <td
                      className={`px-4 py-3 text-sm text-blue-300 border-r bg-sch-blue-dark/10 border-white/10 sticky left-[350px] z-20`}
                    >
                      {student.group_name}
                    </td>

                    {/* Остальные колонки */}
                    <td className="px-4 py-3 text-center border-r border-white/10">
                      <div className="flex flex-col items-center">
                        <div
                          className={`text-lg font-bold ${getScoreColor(totalScore)}`}
                        >
                          {totalScore}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">баллов</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center border-r border-white/10">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-semibold text-white">
                          {completedEvents}
                          <span className="text-xs text-gray-400">
                            /{allEvents.length}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {allEvents.length > 0
                            ? `${Math.round((completedEvents / allEvents.length) * 100)}%`
                            : "0%"}
                        </div>
                      </div>
                    </td>

                    {/* Результаты по мероприятиям */}
                    {allEvents.map((eventId) => {
                      const event = student.events[eventId] as
                        | StudentEvent
                        | undefined;

                      if (!event) {
                        return (
                          <td
                            key={eventId}
                            className="px-3 py-3 text-center border-r border-white/10"
                          >
                            <div className="text-gray-400 text-sm">—</div>
                          </td>
                        );
                      }

                      const statusInfo = getEventStatus(event);

                      return (
                        <td
                          key={eventId}
                          className="px-3 py-3 text-center border-r border-white/10"
                        >
                          <div className="flex flex-col items-center space-y-2 group relative">
                            {/* Статус */}
                            <div
                              className={`text-xs px-2 py-1 rounded-full font-medium ${statusInfo.color}`}
                            >
                              {statusInfo.status}
                            </div>

                            {/* Прогресс стадий */}
                            <div className="text-xs text-gray-300">
                              {event.completed_stages_count}/
                              {event.min_stages_required}
                            </div>

                            {/* Баллы мероприятия */}
                            <div className="text-xs font-bold text-emerald-400">
                              {event.total_score || 0}б
                            </div>

                            {/* Подсказка с деталями по стадиям */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-gray-800/95 border border-white/20 rounded-lg p-3 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl backdrop-blur-sm">
                              <div className="text-sm font-semibold text-white mb-2 border-b border-white/10 pb-1">
                                {event.event_name}
                              </div>
                              <div className="space-y-2">
                                {event.stages.map((stage, stageIndex) => (
                                  <div
                                    key={stageIndex}
                                    className="flex justify-between items-center text-xs"
                                  >
                                    <span className="text-gray-200 truncate flex-1 mr-3">
                                      {stage.name}
                                    </span>
                                    <span
                                      className={`font-bold px-2 py-0.5 rounded ${
                                        stage.status === "зачет"
                                          ? "bg-emerald-500/30 text-emerald-300"
                                          : "bg-red-500/30 text-red-300"
                                      }`}
                                    >
                                      {stage.current_score}б
                                    </span>
                                  </div>
                                ))}
                              </div>
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

      {/* Статистика */}
      {filteredAndSortedStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/20 backdrop-blur-sm rounded-lg p-4 border border-emerald-500/30">
            <div className="text-2xl font-bold text-emerald-300">
              {Math.max(
                ...filteredAndSortedStudents.map((s) => s.metrics.totalScore)
              )}
            </div>
            <div className="text-sm text-emerald-200/80">Максимальный балл</div>
          </div>

          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-300">
              {filteredAndSortedStudents.length > 0
                ? (
                    filteredAndSortedStudents.reduce(
                      (sum, s) => sum + s.metrics.totalScore,
                      0
                    ) / filteredAndSortedStudents.length
                  ).toFixed(0)
                : "0"}
            </div>
            <div className="text-sm text-blue-200/80">Средний балл группы</div>
          </div>

          <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-300">
              {
                filteredAndSortedStudents.filter(
                  (s) => s.metrics.completedEvents === allEvents.length
                ).length
              }
            </div>
            <div className="text-sm text-purple-200/80">
              Выполнили все мероприятия
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PivotTableView;
