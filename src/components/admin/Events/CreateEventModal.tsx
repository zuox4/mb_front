// components/admin/Events/CreateEventModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface EventType {
  id: number;
  name: string;
}

interface CreateEventModalProps {
  onEventCreated?: () => void;
}

const CreateEventModal = ({ onEventCreated }: CreateEventModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    eventTypeId: "",
    startDate: "",
    endDate: "",
  });

  // Загрузка типов мероприятий с бэка
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setLoading(true);
        // Замените на ваш реальный endpoint
        const response = await fetch("/api/event-types");
        if (response.ok) {
          const data = await response.json();
          setEventTypes(data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке типов мероприятий:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchEventTypes();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация дат
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("Дата окончания должна быть позже даты начала");
      return;
    }

    try {
      setLoading(true);
      // Отправка данных на бэк
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          eventTypeId: formData.eventTypeId,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (response.ok) {
        // Успешное создание
        setIsOpen(false);
        setFormData({ title: "", eventTypeId: "", startDate: "", endDate: "" });
        onEventCreated?.(); // Колбэк для обновления списка мероприятий
      }
    } catch (error) {
      console.error("Ошибка при создании мероприятия:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Автоматически устанавливаем конечную дату
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      startDate,
      // Если конечная дата раньше начальной или не установлена, устанавливаем её на 1 час позже
      endDate:
        !prev.endDate || prev.endDate <= startDate
          ? new Date(new Date(startDate).getTime() + 60 * 60 * 1000)
              .toISOString()
              .slice(0, 16)
          : prev.endDate,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sch-green-light text-white">
          Создать новое мероприятие
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-sch-graphite text-white">
        <DialogHeader>
          <DialogTitle>Создать новое мероприятие</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Название мероприятия */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Название мероприятия *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название мероприятия"
              required
              className="bg-sch-graphite-dark border-sch-gray text-white"
            />
          </div>

          {/* Тип мероприятия */}
          <div className="space-y-2">
            <label htmlFor="eventTypeId" className="text-sm font-medium">
              Тип мероприятия *
            </label>
            <select
              id="eventTypeId"
              name="eventTypeId"
              value={formData.eventTypeId}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md bg-sch-graphite-dark border border-sch-gray text-white"
            >
              <option value="">Выберите тип мероприятия</option>
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {loading && (
              <p className="text-sm text-sch-gray">Загрузка типов...</p>
            )}
          </div>

          {/* Дата и время начала */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Начало мероприятия *
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={formData.startDate}
              onChange={handleStartDateChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="bg-sch-graphite-dark border-sch-gray text-white"
            />
          </div>

          {/* Дата и время окончания */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Окончание мероприятия *
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate || new Date().toISOString().slice(0, 16)}
              className="bg-sch-graphite-dark border-sch-gray text-white"
            />
          </div>

          {/* Информация о длительности */}
          {formData.startDate && formData.endDate && (
            <div className="p-3 bg-sch-graphite-dark rounded-md text-sm">
              <p>Длительность мероприятия: </p>
              <p className="text-sch-green-light font-medium">
                {Math.round(
                  (new Date(formData.endDate).getTime() -
                    new Date(formData.startDate).getTime()) /
                    (1000 * 60 * 60)
                )}{" "}
                часов
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-sch-gray text-white"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.startDate || !formData.endDate}
              className="flex-1 bg-sch-green-light text-white disabled:bg-sch-gray disabled:cursor-not-allowed"
            >
              {loading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
