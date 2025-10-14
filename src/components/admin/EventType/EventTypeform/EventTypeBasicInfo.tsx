// components/EventTypeBasicInfo.tsx
import React from "react";

interface EventTypeBasicInfoProps {
  title: string;
  description: string;
  minStagesForCompletion: number;
  leaderId?: number | null;
  onChange: (field: string, value: string | number | null) => void;
}

const EventTypeBasicInfo: React.FC<EventTypeBasicInfoProps> = ({
  title,
  description,
  minStagesForCompletion,
  onChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value === "" ? null : parseInt(value, 10));
  };

  return (
    <div className="bg-white rounded-lg border border-sch-blue-ultra p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Основная информация
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название типа мероприятия *
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Введите название типа мероприятия"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание типа мероприятия
          </label>
          <textarea
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Введите описание типа мероприятия"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Минимальное количество этапов для завершения
            </label>
            <input
              type="number"
              name="min_stages_for_completion"
              value={minStagesForCompletion}
              onChange={handleNumberChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Сколько этапов нужно завершить для успешного прохождения
              мероприятия
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTypeBasicInfo;
