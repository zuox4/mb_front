// components/project-office/ProjectOfficeStudentRow.tsx
import { StageInfo } from "@/hooks/teacher/journal/types";
import { ProjectOfficeJournal } from "@/hooks/teacher/journal/useProjectOfficeJournal";
import React from "react";
import ReadOnlyStageResult from "../class-teacher/ReadOnlyStageResult";

interface ProjectOfficeStudentRowProps {
  student: ProjectOfficeJournal;
  studentIndex: number;
  allStages: StageInfo[];
  onStudentClick: (student: ProjectOfficeJournal) => void;
}

const ProjectOfficeStudentRow: React.FC<ProjectOfficeStudentRowProps> = ({
  student,
  studentIndex,
  allStages,
  onStudentClick,
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
    <tr
      className={`
        ${studentIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} 
        hover:bg-gray-700 cursor-pointer transition-colors
      `}
      onClick={() => onStudentClick(student)}
    >
      {/* Класс */}
      <td className="px-3 py-2 text-sm text-white border-r border-gray-700">
        <div className="font-medium text-blue-300">{student.group_name}</div>
      </td>

      {/* Ученик */}
      <td className="px-3 py-2 text-sm text-white border-r border-gray-700 sticky left-0 bg-inherit">
        <div className="font-medium">{student.student_name}</div>
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
      </td>

      {/* Стадии */}
      {allStages.map((stage) => {
        const studentStage = student.stages?.find((s) => s.name === stage.name);
        return (
          <td
            key={stage.name}
            className="px-2 py-2 text-center border-r border-gray-700"
          >
            <ReadOnlyStageResult stage={studentStage} />
          </td>
        );
      })}

      {/* Общий балл */}
      <td className="px-4 py-3 text-center sticky right-0 bg-inherit">
        <div className="flex flex-col items-center space-y-1">
          <div
            className={`text-lg font-bold ${
              student.total_score > 0
                ? student.completed_stages_count >= student.min_stages_required
                  ? "text-green-400"
                  : "text-yellow-400"
                : "text-gray-400"
            }`}
          >
            {student.total_score}
          </div>
          <div className="text-xs text-gray-400">
            {student.completed_stages_count}/{student.min_stages_required}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ProjectOfficeStudentRow;
