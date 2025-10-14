// components/AddEventTypeForm.tsx
import { useCreateEventType } from "@/hooks/admin/event_types";
import React, { useState } from "react";
import { EventType, Stage } from "../types/event_type";
import EventTypeBasicInfo from "./EventTypeBasicInfo";
import StagesManager from "./StagesManager";

interface AddEventTypeFormProps {
  onSuccess?: () => void;
}

const AddEventTypeForm: React.FC<AddEventTypeFormProps> = ({ onSuccess }) => {
  const [eventTypeData, setEventTypeData] = useState<
    Omit<EventType, "id" | "leader">
  >({
    title: "",
    description: "",
    leader_id: null,
    min_stages_for_completion: 0,
    stages: [],
  });

  const {
    mutate: createEventType,
    isPending: isSubmitting,
    error,
  } = useCreateEventType();

  const handleEventTypeChange = (
    field: string,
    value: string | number | null
  ) => {
    setEventTypeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStagesUpdate = (stages: Stage[]) => {
    setEventTypeData((prev) => ({
      ...prev,
      stages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (eventTypeData.title.trim() === "") {
      alert("Введите название типа мероприятия");
      return;
    }

    if (eventTypeData.stages.length === 0) {
      alert("Добавьте хотя бы одну стадию");
      return;
    }

    // Подготавливаем данные для отправки
    const submitData = {
      title: eventTypeData.title,
      description: eventTypeData.description || null,
      leader_id: eventTypeData.leader_id,
      min_stages_for_completion: eventTypeData.min_stages_for_completion,
      stages: eventTypeData.stages.map((stage) => ({
        title: stage.title,
        min_score_for_finished: stage.min_score_for_finished,
        stage_order: stage.stage_order,
        possible_results: stage.possible_results.map((result) => ({
          title: result.title,
          points_for_done: result.points_for_done,
        })),
      })),
    };

    createEventType(submitData, {
      onSuccess: () => {
        console.log("Тип мероприятия успешно создан!");

        // Сброс формы
        setEventTypeData({
          title: "",
          description: "",
          leader_id: null,
          min_stages_for_completion: 0,
          stages: [],
        });

        // Вызов callback при успехе
        onSuccess?.();
      },
      onError: (error) => {
        console.error("Ошибка при создании типа мероприятия:", error);
        alert(`Ошибка: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-6">
      {/* Отображение ошибки */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <EventTypeBasicInfo
          title={eventTypeData.title}
          description={eventTypeData.description}
          minStagesForCompletion={eventTypeData.min_stages_for_completion}
          leaderId={eventTypeData.leader_id}
          onChange={handleEventTypeChange}
        />

        <StagesManager
          stages={eventTypeData.stages}
          onStagesUpdate={handleStagesUpdate}
        />

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              // Сброс формы при отмене
              setEventTypeData({
                title: "",
                description: "",
                leader_id: null,
                min_stages_for_completion: 0,
                stages: [],
              });
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Очистить форму
          </button>

          <button
            type="submit"
            disabled={eventTypeData.stages.length === 0 || isSubmitting}
            className={`px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              eventTypeData.stages.length === 0 || isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
            }`}
          >
            {isSubmitting ? "Создание..." : "Создать тип мероприятия"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventTypeForm;
