import { ProjectOfficeJournal } from "@/hooks/teacher/journal/useProjectOfficeJournal";
import React from "react";

interface ProjectOfficeStatsProps {
  journalData: ProjectOfficeJournal[];
}

const ProjectOfficeStats: React.FC<ProjectOfficeStatsProps> = ({
  journalData,
}) => {
  if (!journalData || journalData.length === 0) return null;

  // Группируем по классам
  const groups = Array.from(
    new Set(journalData.map((student) => student.group_name))
  ).filter(Boolean);

  const totalStudents = journalData.length;
  const completedStudents = journalData.filter(
    (student) => student.completed_stages_count >= student.min_stages_required
  ).length;

  const averageScore =
    journalData.reduce((sum, student) => sum + student.total_score, 0) /
    totalStudents;

  // Статистика по классам
  const groupStats = groups.map((groupName) => {
    const groupStudents = journalData.filter(
      (student) => student.group_name === groupName
    );
    const groupCompleted = groupStudents.filter(
      (student) => student.completed_stages_count >= student.min_stages_required
    ).length;

    return {
      name: groupName,
      total: groupStudents.length,
      completed: groupCompleted,
      completionRate: (groupCompleted / groupStudents.length) * 100,
      averageScore:
        groupStudents.reduce((sum, s) => sum + s.total_score, 0) /
        groupStudents.length,
    };
  });

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
        Аналитика мероприятия
      </h2>

      {/* Общая статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">
            {groups.length}
          </div>
          <div className="text-gray-300 text-sm">Классов</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{totalStudents}</div>
          <div className="text-gray-300 text-sm">Учеников</div>
        </div>

        <div className="bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">
            {completedStudents}
          </div>
          <div className="text-gray-300 text-sm">Завершили</div>
        </div>

        <div className="bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-400">
            {averageScore.toFixed(1)}
          </div>
          <div className="text-gray-300 text-sm">Средний балл</div>
        </div>
      </div>

      {/* Статистика по классам */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-white">
          Статистика по классам
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupStats.map((group, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="font-medium text-white mb-3 text-sm">
                {group.name}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Учеников:</span>
                  <span className="text-white font-semibold">
                    {group.total}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Завершили:</span>
                  <span className="text-green-400 font-semibold">
                    {group.completed} ({group.completionRate.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Средний балл:</span>
                  <span className="text-yellow-400 font-semibold">
                    {group.averageScore.toFixed(1)}
                  </span>
                </div>

                <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${group.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Статистика по стадиям */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white">
          Эффективность стадий
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stageStats.map((stage, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="font-medium text-white mb-2 text-sm">
                {stage.name}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Успешных:</span>
                <span className="text-green-400 font-semibold">
                  {stage.completed}
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${stage.completionRate}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-400 mt-1">
                {stage.completionRate.toFixed(1)}% успешности
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOfficeStats;
