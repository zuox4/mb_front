// components/EventTypeCard.tsx
import { Calendar, Delete } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventType } from "../types/event_type";
import EventTypeHeader from "./EventTypeHeader";
import Modal from "./Modal"; // предполагаем, что у вас есть компонент модального окна

interface EventTypeCardProps {
  eventType: EventType;
  onArchive?: (id: number) => void; // функция для архивации
}

const EventTypeCard: React.FC<EventTypeCardProps> = ({
  eventType,
  onArchive,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openRemoveModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // предотвращаем всплытие события к родительскому элементу
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = () => {
    navigate(`${eventType.id}`, { state: { eventType } });
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(eventType.id);
    }
    closeModal();
  };

  return (
    <>
      <div className="cursor-pointer group relative bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30">
        <div className="flex items-start justify-between">
          {/* Основная информация */}
          <div>{eventType.is_archived && "В архиве"}</div>
          <div
            className="flex-1 min-w-0 cursor-pointer items-center"
            onClick={handleCardClick}
          >
            <div className="flex items-center gap-3">
              <div className="py-1 rounded-lg text-white">
                <Calendar className="w-4 h-4 text-white" />
              </div>

              <EventTypeHeader
                title={eventType.title}
                description={eventType.description}
              />
            </div>
          </div>

          {/* Кнопка удаления/архивации */}
          <Delete
            className="text-white cursor-pointer hover:text-red-500 transition-colors duration-200"
            onClick={openRemoveModal}
          />
        </div>
      </div>

      {/* Модальное окно подтверждения */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="p-6 bg-white rounded-xl max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Подтверждение удаления
            </h2>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>
                  Действительно удалить всю информацию о типе мероприятия?
                </strong>
              </p>
              <p className="text-red-600 text-sm">
                ⚠️ Внимание! Удалятся все результаты учеников, а также
                мероприятия, закрепленные за этим типом.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={closeModal}>Отмена</button>
              <button onClick={handleArchive}>Архивировать</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EventTypeCard;
