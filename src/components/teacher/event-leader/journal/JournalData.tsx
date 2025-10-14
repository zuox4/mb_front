import { useAuth } from "@/hooks/auth";
import { StageInfo } from "@/hooks/teacher/journal/types";
import {
  useJournalData,
  useUpdateResult,
} from "@/hooks/teacher/journal/useJournal";
import React from "react";
import StudentRow from "./StudentRow";

interface JournalDataProps {
  eventId: number | null;
  groupId: number | null;
}

// Компонент для отображения данных журнала
const JournalData: React.FC<JournalDataProps> = ({ eventId, groupId }) => {
  const { user } = useAuth();

  const {
    data: journalData,
    isLoading,
    error,
  } = useJournalData(eventId, groupId);
  const updateResultMutation = useUpdateResult();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-4">
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  if (!journalData || journalData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Нет данных для отображения
      </div>
    );
  }

  // Получаем все уникальные стадии из данных
  const allStages = journalData.reduce((stages: StageInfo[], student) => {
    student.stages?.forEach((stage) => {
      if (!stages.find((s) => s.name === stage.name)) {
        stages.push({
          name: stage.name,
          stage_id: stage.stage_id,
          min_required_score: stage.min_required_score,
        });
      }
    });
    return stages;
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-3 text-left text-sm font-medium text-white border-r border-gray-600 sticky left-0 bg-gray-700 z-10">
              Ученик
            </th>
            {allStages.map((stage) => (
              <th
                key={stage.name}
                className="px-4 py-3 text-center text-sm font-medium text-white border-r border-gray-600 min-w-[180px]"
              >
                <div>{stage.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {journalData.map((student, studentIndex) => (
            <StudentRow
              key={student.id}
              student={student}
              studentIndex={studentIndex}
              allStages={allStages}
              eventId={eventId!}
              groupId={groupId!}
              teacherId={user?.id || 1}
              updateResultMutation={updateResultMutation}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JournalData;
