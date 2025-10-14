// components/StageList.tsx
import React from "react";
import { Stage } from "../types/event_type";

interface StageListProps {
  stages: Stage[];
  onRemoveStage: (stageId: number | undefined) => void;
  onUpdateStage?: (
    stageId: number | undefined,
    updatedStage: Partial<Stage>
  ) => void;
}

const StageList: React.FC<StageListProps> = ({ stages, onRemoveStage }) => {
  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 mb-4">
        Добавленные стадии:
      </h3>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div
            key={stage.id || `stage-${index}`}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-lg font-medium text-gray-800">
                  Этап {index + 1}: {stage.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Порядок: {stage.stage_order} | Минимальный балл:{" "}
                  {stage.min_score_for_finished}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveStage(stage.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
              >
                Удалить
              </button>
            </div>

            <div>
              <p className="font-medium text-sm text-gray-700 mb-2">
                Возможные результаты:
              </p>
              {stage.possible_results.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {stage.possible_results.map((result, resultIndex) => (
                    <li key={result.id || `result-${resultIndex}`}>
                      {result.title} - {result.points_for_done} баллов
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Нет добавленных результатов
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageList;
