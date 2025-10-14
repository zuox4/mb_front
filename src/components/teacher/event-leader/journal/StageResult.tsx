import { StudentJournal } from "@/hooks/teacher/journal/types";
import { UpdateResultMutation } from "@/hooks/teacher/journal/useJournal";
import React from "react";

interface StageResultProps {
  stage: StudentJournal["stages"][0] | undefined;
  studentId: number;
  eventId: number;
  stageId: number;
  teacherId: number;
  groupId: number;
  updateResultMutation: UpdateResultMutation;
}

const StageResult: React.FC<StageResultProps> = ({
  stage,
  studentId,
  eventId,
  stageId,
  teacherId,
  groupId,
  updateResultMutation,
}) => {
  const handleResultChange = (resultId: string) => {
    // Теперь TypeScript не ругается на null
    const resultIdValue = resultId === "" ? null : parseInt(resultId);

    updateResultMutation.mutate({
      eventId,
      studentId,
      stageId,
      resultId: resultIdValue,
      teacherId,
      groupId,
    });
  };

  if (!stage) {
    return (
      <div className="flex flex-col items-center">
        <select
          disabled
          className="text-xs px-3 py-2 rounded border bg-gray-700 text-gray-400 border-gray-600 w-full cursor-not-allowed"
        >
          <option value="">Нет данных</option>
        </select>
      </div>
    );
  }

  const currentResult = stage.possible_results?.find(
    (result) => result.title === stage.result_title
  );

  const selectedValue = currentResult ? currentResult.id.toString() : "";

  const getSelectColor = () => {
    if (stage.status === "зачет") {
      return "bg-green-500 text-white border-green-600";
    } else if (stage.status === "незачет" && stage.current_score > 0) {
      return "bg-yellow-500 text-black border-yellow-600";
    } else {
      return "bg-gray-600 text-white border-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 ">
      <select
        value={selectedValue}
        onChange={(e) => handleResultChange(e.target.value)}
        disabled={updateResultMutation.status === "pending"}
        className={`text-xs px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 w-full transition-colors ${getSelectColor()} ${
          updateResultMutation.status === "pending"
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <option value="">
          {currentResult ? "✗ Удалить результат" : "— Не выбрано —"}
        </option>

        {stage.possible_results?.map((result) => (
          <option
            key={result.id}
            value={result.id.toString()}
            className={
              result.points >= stage.min_required_score
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }
          >
            {result.title} ({result.points}б)
            {result.points >= stage.min_required_score ? " ✓" : " ✗"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StageResult;
