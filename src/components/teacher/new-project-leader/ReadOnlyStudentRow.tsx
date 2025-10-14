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
    <tr className={studentIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}>
      <td className="px-4 py-2 text-sm text-white border-r border-gray-700 sticky left-0 bg-inherit flex items-center gap-3">
        <div
          className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
            overallStatus === "зачет"
              ? "bg-green-500 text-white"
              : overallStatus === "в процессе"
                ? "bg-yellow-500 text-black"
                : "bg-gray-500 text-white"
          }`}
        >
          {overallStatus}
        </div>
        <div className="font-medium">{student.student_name}</div>
      </td>

      {allStages.map((stage) => {
        const studentStage = student.stages?.find((s) => s.name === stage.name);
        return (
          <td
            key={stage.name}
            className="px-2 text-center border-r border-gray-700"
          >
            <ReadOnlyStageResult stage={studentStage} />
          </td>
        );
      })}
    </tr>
  );
};

export default ReadOnlyStudentRow;
