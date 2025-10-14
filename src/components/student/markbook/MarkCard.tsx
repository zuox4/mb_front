import { type EventMark } from "@/hooks/student/useMarkBook";
import ExpandableStages from "./ExpandableStages";
import StatusBadge from "./StatusBadge";

export interface MarkCardProps {
  mark: EventMark;
  isExpanded: boolean;
  onToggle: () => void;
}

function MarkCard({ mark, isExpanded, onToggle }: MarkCardProps) {
  const totalStages = mark.stages.length;
  const totalSuccese = mark.stages.filter((stage) => stage.result_title).length;

  console.log();
  return (
    <div className="bg-white/2 rounded-lg border border-gray-200/40 overflow-hidden">
      {/* Основная строка */}
      <div
        className="flex items-center justify-between p-4 hover:bg-gray-50/5 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-codec text-white">{mark.eventName}</h3>
        </div>
        <div></div>
        <div className="flex items-center gap-4">
          <StatusBadge status={mark.type} text={mark.type} />
          <span className="text-white">
            {totalSuccese}/{totalStages}
          </span>

          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Раскрывающаяся часть с этапами */}
      <ExpandableStages isExpanded={isExpanded} stages={mark.stages} />
    </div>
  );
}
export default MarkCard;
