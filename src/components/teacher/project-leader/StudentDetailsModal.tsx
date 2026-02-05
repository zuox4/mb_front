// components/project-office/StudentDetailsModal.tsx
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  X,
  Star,
  Filter,
  Target,
  BarChart3,
  UserCheck,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

// Используем типы из PivotStudent вместо своих интерфейсов
// type PivotStudentEvent = {
//   event_name: string;
//   total_score: number;
//   completed_stages_count: number;
//   min_stages_required: number;
//   is_important: boolean; // Обязательное поле
//   status: "зачет" | "незачет" | "в процессе" | "не начато";
//   stages: {
//     name: string;
//     status: string;
//     current_score: number;
//     min_required_score: number;
//     result_title?: string;
//   }[];
// };

interface StudentDetailsModalProps {
  student: PivotStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  // Переносим все хуки наверх
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "important">("all");

  if (!isOpen || !student) return null;

  const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const events = Object.entries(student.events || {});

  // Фильтрация мероприятий (без useMemo)
  const filteredEvents =
    activeTab === "important"
      ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
        events.filter(([_, event]) => event.is_important === true)
      : events;

  // Статистика по всем мероприятиям
  const allEvents = events;
  const totalEvents = allEvents.length;
  const completedEvents = allEvents.filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, e]) => e.status === "зачет",
  ).length;
  const importantEvents = allEvents.filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, e]) => e.is_important === true,
  ).length;
  const completedImportantEvents = allEvents.filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, e]) => e.is_important === true && e.status === "зачет",
  ).length;

  // Статистика по отфильтрованным мероприятиям
  const filteredTotalEvents = filteredEvents.length;
  const filteredCompletedEvents = filteredEvents.filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, e]) => e.status === "зачет",
  ).length;

  const successRate =
    totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;
  const importantSuccessRate =
    importantEvents > 0
      ? (completedImportantEvents / importantEvents) * 100
      : 0;

  // Цвета для статусов
  const getStatusColor = (status: string) => {
    switch (status) {
      case "зачет":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "в процессе":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "зачет":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "в процессе":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {student.student_name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  {student.group_name}
                </span>
                {student.class_teacher && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                    <Calendar className="w-3.5 h-3.5" />
                    {student.class_teacher}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Основная информация */}
        <div className="p-6">
          {/* Табы */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Все мероприятия ({totalEvents})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("important")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === "important"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Важные мероприятия ({importantEvents})
                </div>
              </button>
            </div>

            {activeTab === "important" && importantEvents === 0 && (
              <div className="text-amber-600 text-sm flex items-center gap-1.5">
                <Star className="w-4 h-4" />У этого ученика нет важных
                мероприятий
              </div>
            )}
          </div>

          {/* Карточки статистики */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Общее количество мероприятий */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 text-sm font-medium">
                  Мероприятий
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredTotalEvents}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {activeTab === "all"
                  ? `из них ${importantEvents} важных`
                  : "только важные"}
              </div>
            </div>

            {/* Зачтено мероприятий */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 text-sm font-medium">
                  Зачтено
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredCompletedEvents}
              </div>
              <div className="text-xs text-emerald-600 mt-1">
                {filteredTotalEvents > 0
                  ? `${Math.round((filteredCompletedEvents / filteredTotalEvents) * 100)}% успеха`
                  : "нет данных"}
              </div>
            </div>

            {/* Прогресс выполнения */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-amber-700 text-sm font-medium">
                  Прогресс
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {activeTab === "all"
                  ? `${successRate.toFixed(1)}%`
                  : `${importantSuccessRate.toFixed(1)}%`}
              </div>
              <div className="text-xs text-amber-600 mt-1">
                {activeTab === "all" ? "общий прогресс" : "прогресс по важным"}
              </div>
            </div>

            {/* Средний балл */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 text-sm font-medium">
                  Средний балл
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredEvents.length > 0
                  ? (
                      filteredEvents.reduce(
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        (sum, [_, e]) => sum + e.total_score,
                        0,
                      ) / filteredEvents.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                {activeTab === "all"
                  ? "по всем мероприятиям"
                  : "по важным мероприятиям"}
              </div>
            </div>
          </div>

          {/* Прогресс бар */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900 font-medium">
                  {activeTab === "all"
                    ? "Общий прогресс"
                    : "Прогресс по важным мероприятиям"}
                </span>
              </div>
              <span className="text-gray-600 text-sm font-medium">
                {filteredCompletedEvents} из {filteredTotalEvents} завершено
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-blue-500 to-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{
                  width: `${
                    filteredTotalEvents > 0
                      ? (filteredCompletedEvents / filteredTotalEvents) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Список мероприятий */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Мероприятия и результаты
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredTotalEvents})
                </span>
              </h3>
            </div>

            {filteredTotalEvents === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  {activeTab === "important"
                    ? "Нет важных мероприятий"
                    : "Нет мероприятий"}
                </h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  {activeTab === "important"
                    ? "У этого ученика пока нет назначенных важных мероприятий."
                    : "Данные о мероприятиях ученика отсутствуют."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map(([eventId, event]) => (
                  <div
                    key={eventId}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors shadow-sm"
                  >
                    {/* Заголовок мероприятия */}
                    <button
                      onClick={() => toggleEvent(eventId)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${getStatusColor(event.status)}`}
                          >
                            {getStatusIcon(event.status)}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {event.event_name}
                              </h4>
                              {event.is_important && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                                  <Star className="w-3 h-3" />
                                  Важное
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {event.completed_stages_count} из{" "}
                                {event.min_stages_required} стадий
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" />
                                {event.total_score} баллов
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Статус */}
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
                        >
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(event.status)}
                            {event.status}
                          </div>
                        </span>

                        {/* Иконка раскрытия */}
                        {expandedEvent === eventId ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Детали мероприятия (аккордеон) */}
                    {expandedEvent === eventId && (
                      <div className="border-t border-gray-100 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Общая информация о мероприятии */}
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <h5 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-blue-600" />
                              Общая статистика
                            </h5>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Общий балл:
                                </span>
                                <span className="text-gray-900 font-semibold">
                                  {event.total_score} баллов
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Завершено стадий:
                                </span>
                                <span className="text-gray-900">
                                  <span className="font-semibold">
                                    {event.completed_stages_count}
                                  </span>{" "}
                                  / {event.min_stages_required}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Процент выполнения:
                                </span>
                                <span className="text-gray-900 font-semibold">
                                  {Math.round(
                                    (event.completed_stages_count /
                                      event.min_stages_required) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Прогресс мероприятия */}
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <h5 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                              Прогресс выполнения
                            </h5>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Выполнение:
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {Math.round(
                                    (event.completed_stages_count /
                                      event.min_stages_required) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(
                                      (event.completed_stages_count /
                                        event.min_stages_required) *
                                        100,
                                      100,
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 text-center">
                                {event.completed_stages_count >=
                                event.min_stages_required
                                  ? "Требования выполнены ✓"
                                  : `Осталось ${event.min_stages_required - event.completed_stages_count} стадий`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Детали по стадиям */}
                        <div className="mt-6">
                          <h5 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Результаты по стадиям
                            <span className="text-sm font-normal text-gray-500 ml-2">
                              ({event.stages.length})
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {event.stages.map((stage, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-xl border transition-all ${
                                  stage.status === "зачет"
                                    ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300"
                                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-start gap-2">
                                    <div
                                      className={`p-1.5 rounded-lg ${
                                        stage.status === "зачет"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      <span className="text-xs font-semibold">
                                        #{index + 1}
                                      </span>
                                    </div>
                                    <span className="text-gray-900 font-medium text-sm leading-tight">
                                      {stage.name}
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                      stage.status === "зачет"
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gray-500 text-white"
                                    }`}
                                  >
                                    {stage.status}
                                  </span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Получено баллов:
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                      {stage.current_score}
                                    </span>
                                  </div>
                                  {stage.min_required_score !== undefined &&
                                    stage.min_required_score > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Требуется:
                                        </span>
                                        <span className="text-gray-900">
                                          {stage.min_required_score} баллов
                                        </span>
                                      </div>
                                    )}
                                  {stage.result_title && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Результат:
                                      </span>
                                      <span className="text-gray-900 font-medium">
                                        {stage.result_title}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Футер */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky bottom-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium">
              {filteredCompletedEvents} из {filteredTotalEvents}
            </span>{" "}
            мероприятий завершено
            {activeTab === "important" && importantEvents > 0 && (
              <span className="ml-2 text-amber-600">
                • Важные: {completedImportantEvents}/{importantEvents}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setActiveTab(activeTab === "all" ? "important" : "all")
              }
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium flex items-center gap-2"
            >
              {activeTab === "all" ? (
                <>
                  <Star className="w-4 h-4" />
                  Показать важные
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Показать все
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
