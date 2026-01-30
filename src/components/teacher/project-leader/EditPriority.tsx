import { useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api/api";

interface EditPriorityProps {
  priority: boolean;
  eventId: number;
  disabled?: boolean;
  showIcon?: boolean;
}

const EditPriority = ({
  priority, // Используем только пропс, без локального состояния
  eventId,
  disabled = false,
  showIcon = true,
}: EditPriorityProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, value }: { id: number; value: boolean }) => {
      const response = await api.post(
        `/project-office/change-event-imp/${id}`,
        {
          value: value,
        },
      );
      return response.data;
    },
    onMutate: (variables) => {
      // Оптимистичное обновление кэша
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["project-office-events"], (old: any) => {
        if (!old) return old;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return old.map((event: any) =>
          event.id === eventId
            ? { ...event, is_important: variables.value }
            : event,
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-office-events"] });
    },
    onError: (error) => {
      console.error("Failed to update priority:", error);
      // Откатываем кэш при ошибке
      queryClient.invalidateQueries({ queryKey: ["project-office-events"] });
    },
  });

  const options = [
    {
      value: false,
      label: "#Рекомендуемое",
      className:
        "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/30",
    },
    {
      value: true,
      label: "#Базовый минимум",
      className:
        "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30",
    },
  ];

  // Используем priority из пропсов напрямую
  const currentOption =
    options.find((opt) => opt.value === priority) || options[0];

  const handleChange = (newValue: boolean) => {
    setIsOpen(false);
    updatePriorityMutation.mutate({
      id: eventId,
      value: newValue,
    });
  };

  const isLoading = updatePriorityMutation.isPending;
  const isButtonDisabled = disabled || isLoading;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => !isButtonDisabled && setIsOpen(!isOpen)}
        disabled={isButtonDisabled}
        className={`
          inline-flex items-center gap-2 px-10 py-1 rounded-full text-sm font-medium
          transition-all duration-200 border min-w-[180px] justify-center
          ${currentOption.className}
          ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
          ${isOpen ? "ring-2 ring-gray-400 ring-opacity-50" : ""}
        `}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {showIcon && (
              <span className="text-xs">{priority ? "⭐" : "📄"}</span>
            )}
            <span>{currentOption.label}</span>
          </>
        )}

        {!isButtonDisabled && !isLoading && (
          <ChevronDown
            className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && !isButtonDisabled && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 mt-2 z-50 min-w-[200px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="p-2">
              <p className="text-xs text-gray-400 px-2 py-1">
                Выберите приоритет:
              </p>

              {options.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleChange(option.value)}
                  disabled={isLoading}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-md text-sm
                    transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                    ${priority === option.value ? "bg-gray-700/50" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${option.value ? "bg-red-500" : "bg-emerald-500"}`}
                    />
                    <span>{option.label}</span>
                  </div>

                  {priority === option.value && !isLoading && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}

                  {isLoading && priority === option.value && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-700 p-2 bg-gray-900/50">
              <p className="text-xs text-gray-400 px-1">
                {priority
                  ? "Важные мероприятия выделяются в отчетах"
                  : "Стандартный приоритет мероприятия"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditPriority;
