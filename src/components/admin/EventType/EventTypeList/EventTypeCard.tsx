// components/EventTypeCard.tsx
import React, { useState } from "react";
import { EventType, Stage } from "../types/event_type";
import StageItem from "./StageItem";

interface EventTypeCardProps {
  eventType: EventType;
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({ eventType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalStages = eventType.stages.length;
  const totalResults = eventType.stages.reduce(
    (sum, stage) => sum + stage.possible_results.length,
    0
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Заголовок карточки */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {eventType.title}
            </h3>

            {eventType.description && (
              <p className="text-gray-600 mb-3">{eventType.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {totalStages} этап(ов)
              </span>

              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {totalResults} результат(ов)
              </span>

              {eventType.min_stages_for_completion > 0 && (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Минимум {eventType.min_stages_for_completion} этап(ов) для
                  завершения
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
            </button>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Стадии */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Этапы мероприятия
            </h4>
            <div className="space-y-4">
              {eventType.stages.map((stage: Stage, index: number) => (
                <StageItem
                  key={stage.id}
                  stage={stage}
                  stageNumber={index + 1}
                />
              ))}
            </div>
          </div>

          {/* Информация о руководителе */}
          {eventType.leader && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Руководитель
              </h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {eventType.leader.display_name?.[0] ||
                      eventType.leader.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {eventType.leader.display_name || "Не указано"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {eventType.leader.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventTypeCard;
