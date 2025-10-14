import { type StageMark } from "@/hooks/student/useMarkBook";
import StageItem from "./StageItem";

// Компонент раскрывающейся части с этапами
export interface ExpandableStagesProps {
  isExpanded: boolean;
  stages: StageMark[];
}

function ExpandableStages({ isExpanded, stages }: ExpandableStagesProps) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="border-t border-gray-100/10 p-4">
        <div
          className={`flex flex-col gap-2 md:grid md:grid-cols-${stages.length}`}
        >
          {stages.map((stage, index) => (
            <StageItem key={index} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default ExpandableStages;
