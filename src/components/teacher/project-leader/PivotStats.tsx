// components/project-office/PivotStats.tsx
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  Users,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Filter,
  Eye,
  EyeOff,
  Settings,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
} from "lucide-react";
import EditPriority from "./EditPriority";

interface PivotStatsProps {
  students: PivotStudent[];
  p_office_id?: string;
}

interface EventStat {
  id: number;
  name: string;
  total: number;
  completed: number;
  completionRate: number;
  averageScore: number;
  is_important: boolean;
  details?: {
    topStudents: Array<{ name: string; score: number }>;
    strugglingStudents: Array<{ name: string; score: number }>;
    recommendations: string[];
  };
}

const PivotStats: React.FC<PivotStatsProps> = ({ students, p_office_id }) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showList, setShowList] = useState<boolean>(true);
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(true);
  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

  // Собираем общую статистику по мероприятиям из данных students
  const eventStats: EventStat[] = useMemo(() => {
    if (students.length === 0) return [];

    const allEventIds = Object.keys(students[0].events || {});
    console.log(p_office_id);
    return allEventIds.map((eventId) => {
      const eventIdNum = parseInt(eventId);
      const eventName =
        students[0]?.events[eventId]?.event_name || "Неизвестно";
      const eventData = students
        .map((student) => student.events[eventId])
        .filter((event) => event);

      const completedInEvent = eventData.filter(
        (event) => event.completed_stages_count >= event.min_stages_required,
      ).length;

      const averageEventScore =
        eventData.length > 0
          ? eventData.reduce(
              (sum, event) => sum + (event.total_score || 0),
              0,
            ) / eventData.length
          : 0;

      // Получаем важность мероприятия из первого студента
      const isImportant = students[0]?.events[eventId]?.is_important === true;

      return {
        id: eventIdNum,
        name: eventName,
        total: eventData.length,
        is_important: isImportant,
        completed: completedInEvent,
        completionRate:
          eventData.length > 0
            ? (completedInEvent / eventData.length) * 100
            : 0,
        averageScore: averageEventScore,
      };
    });
  }, [students]);

  // Фильтрация мероприятий по важности
  const filteredEvents = useMemo(() => {
    if (showImportantOnly) {
      return eventStats.filter((event) => event.is_important);
    }
    return eventStats;
  }, [eventStats, showImportantOnly]);

  // Общая статистика
  const totalStats = useMemo(() => {
    const totalStudents = students.length;
    const totalEvents = filteredEvents.length;
    const totalCompleted = filteredEvents.reduce(
      (sum, event) => sum + event.completed,
      0,
    );
    const totalPossible = filteredEvents.reduce(
      (sum, event) => sum + event.total,
      0,
    );
    const overallCompletionRate =
      totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

    return {
      totalStudents,
      totalEvents,
      overallCompletionRate,
      totalCompleted,
    };
  }, [filteredEvents, students.length]);

  // Получение цвета для прогресса
  const getProgressColor = (rate: number) => {
    if (rate >= 80) return "text-emerald-400";
    if (rate >= 60) return "text-green-400";
    if (rate >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  // Получение иконки для статуса
  const getStatusIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (rate >= 60) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (rate >= 40) return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  // Сокращение длинных названий
  const truncateName = (name: string, maxLength: number = 35) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
      {/* Заголовок и управление */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Статистика мероприятий
          </h3>
          {/* <p className="text-gray-300 text-xs mt-0.5">
            {showImportantOnly
              ? `${filteredEvents.length} важных мероприятий`
              : `${filteredEvents.length} мероприятий`}
          </p> */}
        </div>

        <div className="flex items-center gap-2">
          {/* Фильтр по важным */}
          <button
            onClick={() => setShowImportantOnly(!showImportantOnly)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              showImportantOnly
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
            }`}
          >
            <Star className="w-4 h-4" />
            {showImportantOnly ? "Только важные" : "Все"}
          </button>

          {/* Показать/скрыть детали */}
          <button
            onClick={() => setShowAllDetails(!showAllDetails)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white text-sm border border-white/10 transition-colors"
          >
            {showAllDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Скрыть детали
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Показать детали
              </>
            )}
          </button>

          {/* Скрыть/показать список */}
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white text-sm border border-white/10 transition-colors"
          >
            {showList ? (
              <>
                <EyeOff className="w-4 h-4" />
                Скрыть
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Показать
              </>
            )}
          </button>
        </div>
      </div>

      {/* Общая статистика - компактный вид */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/10 rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-300">Учеников</span>
          </div>
          <div className="text-lg font-bold text-white">
            {totalStats.totalStudents}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-300">Мероприятий</span>
          </div>
          <div className="text-lg font-bold text-white">
            {totalStats.totalEvents}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-300">Выполнено</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">
            {totalStats.overallCompletionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {totalStats.totalCompleted} из{" "}
            {totalStats.totalEvents * students.length}
          </div>
        </div>

        {/* <div className="bg-white/10 rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-300">Ср. прогресс</span>
          </div>
          <div className="text-lg font-bold text-amber-400">
            {(
              filteredEvents.reduce((sum, e) => sum + e.completionRate, 0) /
                filteredEvents.length || 0
            ).toFixed(1)}
            %
          </div>
        </div> */}
      </div>

      {/* Список мероприятий */}
      {showList && (
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              {showImportantOnly
                ? "Нет важных мероприятий"
                : "Нет данных о мероприятиях"}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`bg-white/10 rounded-lg border transition-all ${
                    expandedEvent === event.id.toString()
                      ? "border-emerald-500/30 bg-white/15"
                      : "border-white/10 hover:border-white/20"
                  } ${event.is_important ? "border-l-3 border-l-amber-500" : ""}`}
                >
                  {/* Заголовок мероприятия */}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                          onClick={() =>
                            setExpandedEvent(
                              expandedEvent === event.id.toString()
                                ? null
                                : event.id.toString(),
                            )
                          }
                          className={`p-1.5 rounded transition-all ${
                            expandedEvent === event.id.toString()
                              ? "bg-emerald-500/20"
                              : "bg-white/10 hover:bg-white/20"
                          }`}
                        >
                          <ChevronRight
                            className={`w-4 h-4 text-emerald-400 transition-transform ${
                              expandedEvent === event.id.toString()
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5
                              className="font-medium text-white truncate text-sm"
                              title={event.name}
                            >
                              {truncateName(event.name, 30)}
                            </h5>
                            {event.is_important && (
                              <Star className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(event.completionRate)}
                              <span
                                className={`font-medium ${getProgressColor(event.completionRate)}`}
                              >
                                {event.completionRate.toFixed(1)}%
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-gray-400">
                              <UserCheck className="w-3.5 h-3.5" />
                              {event.completed}/{event.total}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-2">
                        <EditPriority
                          priority={event.is_important}
                          eventId={event.id}
                          p_office_id={p_office_id}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Детали мероприятия */}
                  {(showAllDetails ||
                    expandedEvent === event.id.toString()) && (
                    <div className="px-3 pb-3 border-t border-white/10 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Прогресс бар */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-300 mb-1">
                            <span>Прогресс</span>
                            <span>{event.completionRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(event.completionRate).replace("text-", "bg-")}`}
                              style={{
                                width: `${Math.min(event.completionRate, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Статистика */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">Выполнили:</span>
                            <span className="text-emerald-400 font-medium">
                              {event.completed} чел.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Кнопка быстрого действия */}
                      {event.completionRate < 60 && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs text-amber-300">
                            <Zap className="w-3.5 h-3.5" />
                            <span>
                              Низкий прогресс. Рекомендуется напомнить
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Итоговая информация */}
          {filteredEvents.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-gray-300">
                  {showImportantOnly
                    ? "Показаны только важные мероприятия"
                    : "Показаны все мероприятия"}
                  <span className="ml-2 text-emerald-300">
                    • Общий прогресс:{" "}
                    {totalStats.overallCompletionRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-400">
                      Важные: {eventStats.filter((e) => e.is_important).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-400">
                      Всего: {eventStats.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Когда список скрыт */}
      {!showList && (
        <div className="bg-white/10 rounded-lg p-4 text-center border border-white/10">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Eye className="w-5 h-5" />
            <span className="text-sm">
              Список мероприятий скрыт. Нажмите "Показать" для просмотра
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PivotStats;
