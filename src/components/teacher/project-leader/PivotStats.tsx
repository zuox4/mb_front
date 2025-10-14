// components/project-office/PivotStats.tsx
import { PivotStudent } from "@/hooks/teacher/useProjectOfficePivot";
import React from "react";

interface PivotStatsProps {
  students: PivotStudent[];
}

const PivotStats: React.FC<PivotStatsProps> = ({ students }) => {
  if (!students || students.length === 0) return null;

  // Собираем статистику по мероприятиям
  const allEvents = students.length > 0 ? Object.keys(students[0].events) : [];

  // Статистика по мероприятиям
  const eventStats = allEvents.map((eventId) => {
    const eventName = students[0]?.events[eventId]?.event_name || "Неизвестно";
    const eventData = students
      .map((student) => student.events[eventId])
      .filter(Boolean);

    const completedInEvent = eventData.filter(
      (event) => event.status === "зачет"
    ).length;
    const averageEventScore =
      eventData.reduce((sum, event) => sum + event.total_score, 0) /
      eventData.length;

    return {
      id: eventId,
      name: eventName,
      total: eventData.length,
      completed: completedInEvent,
      completionRate: (completedInEvent / eventData.length) * 100,
      averageScore: averageEventScore,
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      {/* Статистика по мероприятиям */}
      {eventStats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-white">
            Эффективность выполнения мероприятий
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventStats.map((event) => (
              <div key={event.id} className="bg-gray-700 rounded-lg p-4">
                <div
                  className="font-medium flex justify-between text-white mb-2 text-sm truncate"
                  title={event.name}
                >
                  {event.name}

                  <span className="text-green-400 font-semibold">
                    {event.completed}/{event.total}
                  </span>
                </div>

                <div className="space-y-2 flex items-center gap-3">
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${event.completionRate}%` }}
                    ></div>
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    {event.completionRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default PivotStats;
