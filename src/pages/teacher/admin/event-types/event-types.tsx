// pages/EventTypesPage.tsx
import EventTypesList from "@/components/admin/EventType/EventTypeList/EventTypeList";
import { useEventTypes } from "@/hooks/admin/event_types";
import { Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const EventTypesPage: React.FC = () => {
  const { data: eventTypes, isLoading, error, refetch } = useEventTypes();
  const navigation = useNavigate();
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="min-h-screen ">
      {/* Заголовок и кнопка создания */}
      <div className="flex items-center mb-6">
        <h1 className="text-white font-codec text-2xl font-codec-news font-bold">
          Типы мероприятий
        </h1>
      </div>

      {/* <CreateEventTypeButton onClick={() => setIsModalOpen(true)} /> */}

      {/* Ошибка */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800">{error.message}</span>
          </div>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )}
      <div className="flex w-fit mb-7 items-center cursor-pointer gap-2 bg-white/10 backdrop-blur-xs px-4 py-2 rounded">
        <span className="text-white">Добавить</span>
        <Plus
          className="text-white cursor-pointer"
          onClick={() => navigation("create")}
        />
      </div>
      {/* Список мероприятий */}
      <EventTypesList eventTypes={eventTypes || []} loading={isLoading} />
    </div>
  );
};

export default EventTypesPage;
