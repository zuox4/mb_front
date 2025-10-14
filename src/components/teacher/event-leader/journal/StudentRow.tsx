import { StageInfo, StudentJournal } from "@/hooks/teacher/journal/types";
import { UpdateResultMutation } from "@/hooks/teacher/journal/useJournal";
import React from "react";
import StageResult from "./StageResult";

interface StudentRowProps {
  student: StudentJournal;
  studentIndex: number;
  allStages: StageInfo[];
  eventId: number;
  groupId: number;
  teacherId: number;
  updateResultMutation: UpdateResultMutation;
}

const StudentRow: React.FC<StudentRowProps> = ({
  student,
  studentIndex,
  allStages,
  eventId,
  groupId,
  teacherId,
  updateResultMutation,
}) => {
  return (
    <tr className={studentIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}>
      <td className="px-4 py-3 text-sm text-white border-r border-gray-700 sticky left-0 bg-inherit">
        <div className="font-medium">{student.student_name}</div>
      </td>

      {allStages.map((stage) => {
        const studentStage = student.stages?.find((s) => s.name === stage.name);
        return (
          <td
            key={stage.name}
            className="px-4 py-3 text-center border-r border-gray-700"
          >
            <StageResult
              stage={studentStage}
              studentId={student.student_id}
              eventId={eventId}
              stageId={stage.stage_id}
              teacherId={teacherId}
              groupId={groupId}
              updateResultMutation={updateResultMutation}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default StudentRow;
