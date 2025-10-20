// components/StageList.tsx
import { Stage } from "../types/event_type";
import StageItem from "./StageItem";

interface StageListProps {
  stages: Stage[];
}

export const StageList: React.FC<StageListProps> = ({ stages }) => {
  // Сортируем этапы по stage_order
  const sortedStages = [...stages].sort(
    (a, b) => a.stage_order - b.stage_order
  );

  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium mb-4 text-white">Этапы мероприятия</h4>
      <div className="gap-3 grid grid-cols-2">
        {sortedStages.map((stage) => (
          <StageItem
            key={stage.id}
            stage={stage}
            stageNumber={stage.stage_order}
          />
        ))}
      </div>
    </div>
  );
};

export default StageList;
