// pages/EventTypesPage.tsx
import CreateEventTypeButton from "@/components/admin/EventType/CreateEventTypeButton";
import CreateEventTypeModal from "@/components/admin/EventType/CreateEventTypeModal";
import EventTypesList from "@/components/admin/EventType/EventTypeList/EventTypeList";
import { useEventTypes } from "@/hooks/admin/event_types";
import React, { useState } from "react";

const EventTypesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: eventTypes, isLoading, error, refetch } = useEventTypes();

  const handleRetry = () => {
    refetch();
  };

  const handleCreateSuccess = () => {
    // Модалка закроется автоматически через onSuccess
    // Данные автоматически обновятся через инвалидацию кэша
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок и кнопка создания */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Типы мероприятий</h1>
            <p className="text-white mt-2">
              Список всех типов мероприятий с этапами и результатами
            </p>
          </div>

          <CreateEventTypeButton onClick={() => setIsModalOpen(true)} />
        </div>

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

        {/* Список мероприятий */}
        <EventTypesList eventTypes={eventTypes || []} loading={isLoading} />

        {/* Кнопка обновления */}
        {!isLoading && (
          <div className="mt-8 text-center">
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Обновить список
            </button>
          </div>
        )}

        {/* Модалка создания */}
        <CreateEventTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

export default EventTypesPage;
