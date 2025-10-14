import { StageMark } from "@/hooks/student/useMarkBook";
import StatusBadge from "./StatusBadge";

// Компонент этапа мероприятия
export interface StageItemProps {
  stage: StageMark;
}

function StageItem({ stage }: StageItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded border border-gray-200/40 bg-gradient-to-r cursor-pointer ${stage.result_title ? "bg-sch-green-light/20" : "bg-red-200/20"} transition-all duration-200 `}
    >
      <div className="flex-1 items-center flex gap-2">
        <h4 className="font-codec-bold text-white">{stage.name}</h4>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-codec text-white text-sm"></span>
        <StatusBadge
          status={stage.status}
          text={stage.status}
          size="sm"
          result_title={stage.result_title}
        />
      </div>
    </div>
  );
}
export default StageItem;
