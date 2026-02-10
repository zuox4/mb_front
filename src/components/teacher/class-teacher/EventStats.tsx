import { StudentJournal } from "@/hooks/teacher/journal/types";
import React from "react";
import { CheckCircle, Users, BarChart3 } from "lucide-react";

interface EventStatsProps {
  journalData: StudentJournal[];
}

const EventStats: React.FC<EventStatsProps> = ({ journalData }) => {
  if (!journalData || journalData.length === 0) return null;

  const totalStudents = journalData.length;
  const completedStudents = journalData.filter(
    (student) => student.completed_stages_count >= student.min_stages_required,
  ).length;
  const completionRate = (completedStudents / totalStudents) * 100;

  // Статистика по стадиям (берем максимум 3 для компактности)
  const stageStats = journalData[0].stages.map((stage, index) => {
    const completedInStage = journalData.filter(
      (student) => student.stages[index]?.status === "зачет",
    ).length;
    return {
      name: stage.name,
      completed: completedInStage,
      completionRate: (completedInStage / totalStudents) * 100,
    };
  });

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Статистика</h3>
        <div className="text-xs text-gray-300">{totalStudents} уч.</div>
      </div>

      {/* Основная статистика в строку */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Users className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-xs text-gray-300">Всего</div>
            <div className="text-lg font-semibold text-white">
              {totalStudents}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <CheckCircle className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="text-xs text-gray-300">Завершили</div>
            <div className="text-lg font-semibold text-emerald-300">
              {completedStudents}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BarChart3 className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <div className="text-xs text-gray-300">Процент</div>
            <div className="text-lg font-semibold text-blue-300">
              {completionRate.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Статистика по стадиям в компактном виде */}
      {stageStats.length > 0 && (
        <div className="border-t border-white/10 pt-3">
          <div className="text-xs font-medium text-gray-300 mb-2">Стадии</div>
          <div className="space-y-2">
            {stageStats.map((stage, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-xs text-gray-400 min-w-[60px] truncate">
                  {stage.name}
                </div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                    style={{ width: `${stage.completionRate}%` }}
                  />
                </div>
                <div className="text-xs text-white min-w-[40px] text-right">
                  {stage.completionRate.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStats;
