import { useCreateGroup } from "@/hooks/admin/useAdminGroups";
import { Plus } from "lucide-react";
import { useState } from "react";

const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const createGroup = useCreateGroup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    // Валидация
    if (!groupName.trim()) {
      setErrors("Название группы не может быть пустым");
      return;
    }

    if (groupName.trim().length < 2) {
      setErrors("Название группы должно содержать минимум 2 символа");
      return;
    }

    createGroup.mutate(
      { name: groupName.trim() },
      {
        onSuccess: () => {
          setGroupName("");
          setIsVisible(false);
          setErrors(null);
        },
        onError: (error) => {
          setErrors(error.message || "Произошла ошибка при создании группы");
        },
      }
    );
  };

  const handleCancel = () => {
    setGroupName("");
    setIsVisible(false);
    setErrors(null);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 w-fit bg-white/10 backdrop-blur-xs px-4 py-2 rounded-3xl cursor-pointer"
      >
        <span className="text-white">Добавить класс</span>
        <Plus className="text-white cursor-pointer" />
      </button>
    );
  }

  return (
    <div className="bg-sch-blue-dark/10 p-4 rounded-lg shadow-md border border-gray-200 max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <h1 className="mb-4 font-codec-news text-white">Добавляем класс</h1>
          <input
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              setErrors(null); // Очищаем ошибки при вводе
            }}
            placeholder="Введите название группы, 10-А"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sch-green-light placeholder:text-white/30 text-white focus:border-transparent transition-all duration-200"
            autoFocus
          />
          {errors && (
            <p className="text-red-500 text-sm mt-1 font-medium">{errors}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={createGroup.isPending}
            className="flex-1 bg-sch-green-light cursor-pointer hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            {createGroup.isPending ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Создание...
              </div>
            ) : (
              "Создать"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={createGroup.isPending}
            className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;
