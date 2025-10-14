// components/StageItem.tsx
import React from "react";
import { Stage } from "../types/event_type";

interface StageItemProps {
  stage: Stage;
  stageNumber: number;
}

const StageItem: React.FC<StageItemProps> = ({ stage, stageNumber }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h5 className="font-medium text-gray-800">
            Этап {stageNumber}: {stage.title}
          </h5>
          <p className="text-sm text-gray-500 mt-1">
            Минимальный балл для завершения:{" "}
            <span className="font-medium">{stage.min_score_for_finished}</span>
          </p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
          Порядок: {stage.stage_order}
        </span>
      </div>

      {/* Возможные результаты */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">
          Возможные результаты:
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {stage.possible_results.map((result) => (
            <div
              key={result.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200"
            >
              <span className="text-sm text-gray-700">{result.title}</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                {result.points_for_done} баллов
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageItem;
