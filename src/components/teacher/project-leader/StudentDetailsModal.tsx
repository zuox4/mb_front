// components/project-office/StudentDetailsModal.tsx
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import React, { useState } from "react";

// Расширяем тип для стадий
interface Stage {
  name: string;
  status: string;
  current_score: number;
  min_required_score?: number; // Делаем опциональным
  result_title?: string;
}

interface Event {
  event_name: string;
  status: string;
  total_score: number;
  completed_stages_count: number;
  min_stages_required: number;
  stages: Stage[];
}

interface ExtendedPivotStudent {
  student_name: string;
  group_name: string;
  class_teacher?: string;
  events: {
    [key: string]: Event;
  };
}

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
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // Приводим тип студента к расширенному типу
  const extendedStudent = student as unknown as ExtendedPivotStudent;

  const totalEvents = Object.keys(extendedStudent.events).length;
  const completedEvents = Object.values(extendedStudent.events).filter(
    (e) => e.status === "зачет"
  ).length;
  const inProgressEvents = Object.values(extendedStudent.events).filter(
    (e) => e.status === "в процессе"
  ).length;

  const successRate =
    totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Заголовок */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-900/95 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {extendedStudent.student_name}
            </h2>
            <p className="text-gray-400 mt-1">
              {extendedStudent.group_name} • {totalEvents} мероприятий
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold hover:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>

        {/* Основная информация */}
        <div className="p-6">
          {/* Карточки статистики */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Общее количество мероприятий */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Мероприятий</div>
              <div className="text-2xl font-bold text-white">{totalEvents}</div>
            </div>

            {/* Зачтено мероприятий */}
            <div className="bg-gray-800 rounded-xl p-4 border border-green-500/20">
              <div className="text-gray-400 text-sm mb-1">Зачтено</div>
              <div className="text-2xl font-bold text-green-400">
                {completedEvents}
              </div>
            </div>

            {/* В процессе */}
            <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-gray-400 text-sm mb-1">В процессе</div>
              <div className="text-2xl font-bold text-yellow-400">
                {inProgressEvents}
              </div>
            </div>

            {/* Успешность */}
            <div className="bg-gray-800 rounded-xl p-4 border border-blue-500/20">
              <div className="text-gray-400 text-sm mb-1">Успешность</div>
              <div className="text-2xl font-bold text-blue-400">
                {successRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Прогресс бар */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-medium">Общий прогресс</span>
              <span className="text-gray-400 text-sm">
                {completedEvents} из {totalEvents} завершено
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>

          {/* Список мероприятий */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Мероприятия и результаты
            </h3>
            <div className="space-y-3">
              {Object.entries(extendedStudent.events).map(
                ([eventId, event]) => (
                  <div
                    key={eventId}
                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                  >
                    {/* Заголовок мероприятия */}
                    <button
                      onClick={() => toggleEvent(eventId)}
                      className="w-full p-4 text-left hover:bg-gray-750 transition-colors flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            event.status === "зачет"
                              ? "bg-green-500"
                              : event.status === "в процессе"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        ></div>
                        <div>
                          <h4 className="font-medium text-white text-lg">
                            {event.event_name}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {event.completed_stages_count} из{" "}
                            {event.min_stages_required} стадий завершено
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {/* Общий результат */}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === "зачет"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : event.status === "в процессе"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {event.status}
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
                      <div className="border-t border-gray-700 p-4 bg-gray-750">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Общая информация о мероприятии */}
                          <div>
                            <h5 className="text-white font-medium mb-3">
                              Общая информация
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Общий балл:
                                </span>
                                <span className="text-white font-medium">
                                  {event.total_score}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Завершено стадий:
                                </span>
                                <span className="text-white">
                                  {event.completed_stages_count} /{" "}
                                  {event.min_stages_required}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Минимальный порог:
                                </span>
                                <span className="text-white">
                                  {event.min_stages_required} стадий
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Прогресс мероприятия */}
                          <div>
                            <h5 className="text-white font-medium mb-3">
                              Прогресс
                            </h5>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">
                                  Выполнение:
                                </span>
                                <span className="text-white">
                                  {Math.round(
                                    (event.completed_stages_count /
                                      event.min_stages_required) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (event.completed_stages_count /
                                        event.min_stages_required) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Детали по стадиям */}
                        <div className="mt-6">
                          <h5 className="text-white font-medium mb-3">
                            Детали по стадиям
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {event.stages.map((stage, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  stage.status === "зачет"
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-gray-700/50 border-gray-600"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-white font-medium text-sm">
                                    {stage.name}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      stage.status === "зачет"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-600 text-gray-300"
                                    }`}
                                  >
                                    {stage.status}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Баллы:</span>
                                  <span className="text-white">
                                    {stage.current_score}
                                  </span>
                                </div>
                                {stage.result_title && (
                                  <div className="flex justify-between text-xs mt-1">
                                    <span className="text-gray-400">
                                      Результат:
                                    </span>
                                    <span className="text-gray-300">
                                      {stage.result_title}
                                    </span>
                                  </div>
                                )}
                                {/* Проверяем существование min_required_score */}
                                {stage.min_required_score !== undefined &&
                                  stage.min_required_score > 0 && (
                                    <div className="flex justify-between text-xs mt-1">
                                      <span className="text-gray-400">
                                        Требуется:
                                      </span>
                                      <span className="text-gray-300">
                                        {stage.min_required_score} баллов
                                      </span>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Футер */}
        <div className="flex justify-end p-4 border-t border-gray-700 bg-gray-900/95 backdrop-blur sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
