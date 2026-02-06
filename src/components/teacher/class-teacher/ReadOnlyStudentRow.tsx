// components/class-teacher/ReadOnlyStudentRow.tsx
import { StageInfo, StudentJournal } from "@/hooks/teacher/journal/types";
import React from "react";
import ReadOnlyStageResult from "./ReadOnlyStageResult";

interface ReadOnlyStudentRowProps {
  student: StudentJournal;
  studentIndex: number;
  allStages: StageInfo[];
}

const ReadOnlyStudentRow: React.FC<ReadOnlyStudentRowProps> = ({
  student,
  studentIndex,
  allStages,
}) => {
  const getOverallStatus = () => {
    if (student.completed_stages_count >= student.min_stages_required) {
      return "зачет";
    } else if (student.total_score > 0) {
      return "в процессе";
    } else {
      return "не начато";
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div
      className={`flex justify-between border-b border-white/10 ${studentIndex % 2 === 0 ? "bg-white/2" : "bg-white/3"}`}
    >
      {/* Первая ячейка (Имя ученика) */}
      <div className="px-3 py-2 text-sm w-[300px] text-white sticky left-0 z-10 bg-inherit whitespace-nowrap min-w-[200px] border-r border-white/10">
        <div className="flex items-center gap-2">
          <div
            className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
              overallStatus === "зачет"
                ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                : overallStatus === "в процессе"
                  ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                  : "bg-gray-500/30 text-gray-300 border border-gray-500/50"
            }`}
          >
            {overallStatus}
          </div>
          <div className="font-medium truncate">{student.student_name}</div>
        </div>
      </div>

      {/* Ячейки с этапами */}
      {allStages.map((stage) => {
        const studentStage = student.stages?.find((s) => s.name === stage.name);
        return (
          <div
            key={stage.name}
            className="max-w-[150px] truncate px-2 py-2 text-center border-r border-white/10 min-w-[140px] flex items-center justify-center"
          >
            <ReadOnlyStageResult stage={studentStage} />
          </div>
        );
      })}
    </div>
  );
};

export default ReadOnlyStudentRow;
