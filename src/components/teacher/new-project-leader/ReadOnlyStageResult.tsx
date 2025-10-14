import { StudentJournal } from "@/hooks/teacher/journal/types";
import React from "react";

interface ReadOnlyStageResultProps {
  stage: StudentJournal["stages"][0] | undefined;
}

const ReadOnlyStageResult: React.FC<ReadOnlyStageResultProps> = ({ stage }) => {
  if (!stage) {
    return (
      <div className="flex flex-col items-center justify-center h-20">
        <div className="text-gray-500 text-sm">—</div>
      </div>
    );
  }

  const currentResult = stage.possible_results?.find(
    (result) => result.title === stage.result_title
  );

  const getStatusColor = () => {
    if (stage.status === "зачет") {
      return "bg-green-500 text-white border-green-600";
    } else if (stage.status === "незачет" && stage.current_score > 0) {
      return "bg-yellow-500 text-black border-yellow-600";
    } else {
      return "bg-gray-600 text-white border-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2  p-2">
      {/* Статус */}
      <div
        className={`text-xs px-3 py-1 rounded border w-full text-center ${getStatusColor()}`}
      >
        {currentResult ? currentResult.title : "Не выполнено"}
      </div>

      {/* Детальная информация */}
      <div className="text-center space-y-1">
        {stage.current_score > 0 && stage.status === "незачет" && (
          <div className="text-xs text-yellow-300">
            Мин: {stage.min_required_score}б
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyStageResult;
