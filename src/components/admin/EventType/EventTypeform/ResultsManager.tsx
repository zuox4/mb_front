// components/ResultsManager.tsx
import React, { useState } from "react";
import { PossibleResult } from "../types/event_type";

interface ResultsManagerProps {
  results: PossibleResult[];
  onResultsUpdate: (results: PossibleResult[]) => void;
}

const ResultsManager: React.FC<ResultsManagerProps> = ({
  results,
  onResultsUpdate,
}) => {
  const [currentResult, setCurrentResult] = useState<
    Omit<PossibleResult, "id">
  >({
    title: "",
    points_for_done: 0,
  });

  const handleResultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentResult((prev) => ({
      ...prev,
      [name]: name === "points_for_done" ? Number(value) : value,
    }));
  };

  const addResult = () => {
    if (currentResult.title.trim() === "") {
      alert("Введите название результата");
      return;
    }

    const newResult: PossibleResult = {
      ...currentResult,
      id: Date.now(), // временный ID
    };

    onResultsUpdate([...results, newResult]);
    setCurrentResult({ title: "", points_for_done: 0 });
  };

  const removeResult = (resultId: number | undefined) => {
    if (!resultId) return;
    onResultsUpdate(results.filter((result) => result.id !== resultId));
  };

  const totalPoints = results.reduce(
    (sum, result) => sum + result.points_for_done,
    0
  );

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          Возможные результаты *
        </h4>
        <div className="text-sm text-gray-500">
          Всего баллов: <span className="font-medium">{totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <input
            type="text"
            name="title"
            value={currentResult.title}
            onChange={handleResultChange}
            placeholder="Название результата"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <input
            type="number"
            name="points_for_done"
            value={currentResult.points_for_done}
            onChange={handleResultChange}
            placeholder="Баллы"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          onClick={addResult}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Добавить результат
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Добавленные результаты:
          </h5>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={result.id || `result-${index}`}
                className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-gray-200"
              >
                <span className="text-sm text-gray-700">
                  {result.title} ({result.points_for_done} баллов)
                </span>
                <button
                  type="button"
                  onClick={() => removeResult(result.id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsManager;
