// components/StagesManager.tsx
import React from "react";
import { Stage } from "../types/event_type";
import StageForm from "./StageForm";
import StageList from "./StageList";

interface StagesManagerProps {
  stages: Stage[];
  onStagesUpdate: (stages: Stage[]) => void;
}

const StagesManager: React.FC<StagesManagerProps> = ({
  stages,
  onStagesUpdate,
}) => {
  const addStage = (newStage: Omit<Stage, "id">) => {
    const stage: Stage = {
      ...newStage,
      id: Date.now(), // временный ID для React key
      stage_order: stages.length + 1,
    };

    onStagesUpdate([...stages, stage]);
  };

  const removeStage = (stageId: number | undefined) => {
    if (!stageId) return;

    // Обновляем порядок оставшихся стадий
    const updatedStages = stages
      .filter((stage) => stage.id !== stageId)
      .map((stage, index) => ({
        ...stage,
        stage_order: index + 1,
      }));

    onStagesUpdate(updatedStages);
  };

  const updateStage = (
    stageId: number | undefined,
    updatedStage: Partial<Stage>
  ) => {
    if (!stageId) return;

    const updatedStages = stages.map((stage) =>
      stage.id === stageId ? { ...stage, ...updatedStage } : stage
    );
    onStagesUpdate(updatedStages);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Добавление стадий
        </h2>
        <div className="text-sm text-gray-500">
          Добавлено стадий: <span className="font-medium">{stages.length}</span>
        </div>
      </div>

      <StageForm onAddStage={addStage} />

      {stages.length > 0 && (
        <StageList
          stages={stages}
          onRemoveStage={removeStage}
          onUpdateStage={updateStage}
        />
      )}
    </div>
  );
};

export default StagesManager;
