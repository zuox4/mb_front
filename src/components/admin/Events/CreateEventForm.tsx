// components/CreateEventForm.tsx
import React, { useState } from "react";
import { useCreateEvent } from "@/hooks/admin/useAdminEvents";
import { useEventTypes } from "@/hooks/admin/event_types";
import { EventType } from "../EventType/types/event_type";

export const CreateEventForm: React.FC = () => {
  const createEventMutation = useCreateEvent();
  const { data: eventTypes, isLoading: typesLoading } = useEventTypes();

  const [formData, setFormData] = useState({
    event_type_id: "",
    title: "",
    academic_year: "",
    date_start: "",
    date_end: "",
    description: "",
    is_active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      event_type_id: parseInt(formData.event_type_id),
      date_start: formData.date_start || null,
      date_end: formData.date_end || null,
      description: formData.description || null,
    };

    createEventMutation.mutate(submitData);
  };

  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}-${currentYear + 1}`,
    `${currentYear + 1}-${currentYear + 2}`,
    `${currentYear + 2}-${currentYear + 3}`,
  ];

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6">Создание нового мероприятия</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Тип мероприятия */}
        <div>
          <label
            htmlFor="event_type_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Тип мероприятия *
          </label>
          <select
            id="event_type_id"
            name="event_type_id"
            value={formData.event_type_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите тип мероприятия</option>
            {eventTypes?.map((eventType: EventType) => (
              <option key={eventType.id} value={eventType.id}>
                {eventType.title}
              </option>
            ))}
          </select>
          {typesLoading && (
            <p className="text-sm text-gray-500">Загрузка типов...</p>
          )}
        </div>

        {/* Название мероприятия */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Название мероприятия *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите название мероприятия"
          />
        </div>

        {/* Учебный год */}
        <div>
          <label
            htmlFor="academic_year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Учебный год *
          </label>
          <select
            id="academic_year"
            name="academic_year"
            value={formData.academic_year}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите учебный год</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Дата начала */}
        <div>
          <label
            htmlFor="date_start"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Дата начала
          </label>
          <input
            type="date"
            id="date_start"
            name="date_start"
            value={formData.date_start}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Дата окончания */}
        <div>
          <label
            htmlFor="date_end"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Дата окончания
          </label>
          <input
            type="date"
            id="date_end"
            name="date_end"
            value={formData.date_end}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Описание */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите описание мероприятия"
          />
        </div>

        {/* Активность */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_active"
            className="ml-2 block text-sm text-gray-700"
          >
            Активное мероприятие
          </label>
        </div>

        {/* Кнопка отправки */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            disabled={createEventMutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createEventMutation.isPending
              ? "Создание..."
              : "Создать мероприятие"}
          </button>
        </div>

        {/* Сообщения об ошибке/успехе */}
        {createEventMutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Ошибка при создании мероприятия:{" "}
              {createEventMutation.error.message}
            </p>
          </div>
        )}

        {createEventMutation.isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">Мероприятие успешно создано!</p>
          </div>
        )}
      </form>
    </div>
  );
};
