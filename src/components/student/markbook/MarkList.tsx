import { type EventMark } from "@/hooks/student/useMarkBook";
import { useMemo, useState } from "react";
import MarkCard from "./MarkCard";

interface MarkListProps {
  marks: EventMark[];
  expandedCard: number | null;
  onToggleCard: (id: number) => void;
}

type FilterType = "all" | "зачет" | "незачет";

function MarkList({ marks, expandedCard, onToggleCard }: MarkListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredMarks = useMemo(() => {
    if (filter === "all") return marks;
    return marks.filter((mark) => mark.type === filter);
  }, [marks, filter]);

  const tabs = [
    { value: "all" as FilterType, label: "Все", count: marks.length },
    {
      value: "зачет" as FilterType,
      label: "Зачет",
      count: marks.filter((m) => m.type === "зачет").length,
    },
    {
      value: "незачет" as FilterType,
      label: "Незачет",
      count: marks.filter((m) => m.type === "незачет").length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                filter === tab.value
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-white hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Список карточек */}
      <div className="space-y-3">
        {filteredMarks.map((mark) => (
          <MarkCard
            key={mark.id}
            mark={mark}
            isExpanded={expandedCard === mark.id}
            onToggle={() => onToggleCard(mark.id)}
          />
        ))}

        {filteredMarks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Нет мероприятий с выбранным фильтром
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkList;
