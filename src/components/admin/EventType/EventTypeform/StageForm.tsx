// components/StageForm.tsx
import React, { useState } from "react";
import { PossibleResult, Stage } from "../types/event_type";
import ResultsManager from "./ResultsManager";

interface StageFormProps {
  onAddStage: (stage: Omit<Stage, "id">) => void;
}

const StageForm: React.FC<StageFormProps> = ({ onAddStage }) => {
  const [stageData, setStageData] = useState<Omit<Stage, "id" | "stage_order">>(
    {
      title: "",
      min_score_for_finished: 0,
      possible_results: [],
    }
  );

  const handleStageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStageData((prev) => ({
      ...prev,
      [name]: name === "min_score_for_finished" ? Number(value) : value,
    }));
  };

  const handleResultsUpdate = (results: PossibleResult[]) => {
    setStageData((prev) => ({
      ...prev,
      possible_results: results,
    }));
  };

  const handleAddStage = () => {
    if (stageData.title.trim() === "") {
      alert("Введите название стадии");
      return;
    }

    if (stageData.possible_results.length === 0) {
      alert("Добавьте хотя бы один возможный результат для стадии");
      return;
    }

    onAddStage({
      ...stageData,
      stage_order: 0, // будет переопределено в StagesManager
    });

    // Сброс формы
    setStageData({
      title: "",
      min_score_for_finished: 0,
      possible_results: [],
    });
  };

  const canAddStage =
    stageData.title.trim() !== "" && stageData.possible_results.length > 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
      <h3 className="text-md font-medium text-gray-700 mb-4">
        Добавление новой стадии
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название стадии *
          </label>
          <input
            type="text"
            name="title"
            value={stageData.title}
            onChange={handleStageChange}
            placeholder="Введите название стадии"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Минимальный балл для завершения *
          </label>
          <input
            type="number"
            name="min_score_for_finished"
            value={stageData.min_score_for_finished}
            onChange={handleStageChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Минимальное количество баллов для успешного прохождения этапа
          </p>
        </div>
      </div>

      <ResultsManager
        results={stageData.possible_results}
        onResultsUpdate={handleResultsUpdate}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddStage}
          disabled={!canAddStage}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            !canAddStage
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          Добавить стадию
        </button>
      </div>
    </div>
  );
};

export default StageForm;
