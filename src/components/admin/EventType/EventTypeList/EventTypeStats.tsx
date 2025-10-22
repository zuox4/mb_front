// components/EventTypeStats.tsx
import { EventType } from "../types/event_type";

interface EventTypeStatsProps {
  eventType: EventType;
}

export const EventTypeStats: React.FC<EventTypeStatsProps> = ({
  eventType,
}) => {
  const totalStages = eventType.stages.length;

  return (
    <div className="flex flex-wrap gap-4 text-sm  text-white">
      <StatItem icon="stages" text={`${totalStages} этап(ов)`} />
      {eventType.min_stages_for_completion > 0 && (
        <StatItem
          icon="minimal"
          text={`Минимум ${eventType.min_stages_for_completion} этап(ов) для завершения`}
        />
      )}
    </div>
  );
};

// Компонент для отображения статистики с иконкой
interface StatItemProps {
  icon: "stages" | "results" | "minimal";
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, text }) => {
  const icons = {
    stages: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    ),
    results: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    minimal: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  };

  return (
    <span className="flex items-center">
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icons[icon]}
      </svg>
      {text}
    </span>
  );
};

export default EventTypeStats;
