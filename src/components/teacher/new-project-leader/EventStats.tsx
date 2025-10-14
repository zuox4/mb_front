import { StudentJournal } from "@/hooks/teacher/journal/types";
import React from "react";

interface EventStatsProps {
  journalData: StudentJournal[];
}

const EventStats: React.FC<EventStatsProps> = ({ journalData }) => {
  if (!journalData || journalData.length === 0) return null;

  const totalStudents = journalData.length;
  const completedStudents = journalData.filter(
    (student) => student.completed_stages_count >= student.min_stages_required
  ).length;

  // Статистика по стадиям
  const stageStats = journalData[0].stages.map((stage, index) => {
    const completedInStage = journalData.filter(
      (student) => student.stages[index]?.status === "зачет"
    ).length;

    return {
      name: stage.name,
      completed: completedInStage,
      completionRate: (completedInStage / totalStudents) * 100,
    };
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Статистика мероприятия
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalStudents}</div>
          <div className="text-gray-300 text-sm">Всего учеников</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {completedStudents}
          </div>
          <div className="text-gray-300 text-sm">Завершили</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {((completedStudents / totalStudents) * 100).toFixed(1)}%
          </div>
          <div className="text-gray-300 text-sm">Процент завершения</div>
        </div>
      </div>

      {/* Статистика по стадиям */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">
          Статистика по стадиям
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stageStats.map((stage, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="font-medium text-white mb-2 text-sm">
                {stage.name}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Зачет:</span>
                <span className="text-green-400 font-semibold">
                  {stage.completed} из {totalStudents}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stage.completionRate}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">
                {stage.completionRate.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventStats;
