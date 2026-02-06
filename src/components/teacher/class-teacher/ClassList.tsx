import api from "@/services/api/api";
import { useEffect, useState } from "react";
import {
  Edit2,
  Mail,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  X,
  Save,
} from "lucide-react";

type Student = {
  id: number;
  display_name: string;
  email: string;
  is_active: boolean;
  group_name: string;
  phone: string | null;
  email_verified_at: string | null;
  verification_sent_at: string | null;
  archived: boolean;
  created_at: string;
  is_verified: boolean;
  updated_at: string;
};

const ClassList = ({ classId }: { classId: number }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const updateStudent = async (studentId: number, data: Partial<Student>) => {
    try {
      await api.patch(`/student/${studentId}`, data);
      // Обновляем локальное состояние
      setStudents(
        students.map((student) =>
          student.id === studentId ? { ...student, ...data } : student,
        ),
      );
      return true;
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
      return false;
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get<Student[]>(
          `/groups/for_group_leader/${classId}`,
        );
        setStudents(response.data);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [classId]); // Только classId в зависимостях

  // Статистика
  const stats = {
    total: students.length,
    is_verified: students.filter((s) => s.is_verified).length,

    pending: students.filter(
      (s) => !s.email_verified_at && s.verification_sent_at,
    ).length,
    archived: students.filter((s) => s.archived).length,
  };

  const toggleRow = (id: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const startEdit = (student: Student) => {
    setEditingId(student.id);
    setEditData({
      display_name: student.display_name,
      email: student.email,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (studentId: number) => {
    if (await updateStudent(studentId, editData)) {
      setEditingId(null);
      setEditData({});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Заголовок */}

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-500">Всего</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {stats.is_verified}
          </div>
          <div className="text-sm text-green-500">Активированы</div>
        </div>
      </div>

      {/* Список учеников */}
      <div className="space-y-2">
        {students.map((student) => {
          const isExpanded = expandedRows.has(student.id);
          const isEditing = editingId === student.id;

          return (
            <div
              key={student.id}
              className="border border-gray-200 rounded-lg overflow-hidden font-codec-news "
            >
              {/* Основная информация */}
              <div className="p-4 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  {/* Левый блок: ФИО и статус */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <User className="w-4 h-4 text-gray-400" />

                      <span className="font-medium text-lg">
                        {student.display_name}
                      </span>

                      {/* Статус активации */}
                      {!student.is_verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>Требуется активация</span>
                        </div>
                      )}
                      {/* {student.email_verified_at && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          <Check className="w-3 h-3" />
                          <span>Активирован</span>
                        </div>
                      )} */}
                      {/* {!student.is_active && (
                        <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Не активирован
                        </div>
                      )} */}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email || student.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{student.email}</span>
                      )}
                    </div>

                    {/* Телефон (если есть) */}
                    {student.phone && (
                      <div className="text-sm text-gray-500 mt-1">
                        📞 {student.phone}
                      </div>
                    )}
                  </div>

                  {/* Правый блок: кнопки */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(student.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Сохранить"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Отменить"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(student)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* {requiresActivation && (
                          <button
                            onClick={() => resendVerification(student.id)}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Отправить верификацию"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )} */}
                      </>
                    )}
                    <button
                      onClick={() => toggleRow(student.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Расширенная информация */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">ID:</div>
                      <div className="font-mono">{student.id}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Дата создания:</div>
                      <div>
                        {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">
                        Последнее обновление:
                      </div>
                      <div>
                        {new Date(student.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    {/* {student.email_verified_at && (
                      <div>
                        <div className="text-gray-500 mb-1">
                          Email подтвержден:
                        </div>

                      </div>
                    )} */}
                    {student.verification_sent_at && (
                      <div>
                        <div className="text-gray-500 mb-1">
                          Верификация отправлена:
                        </div>
                        <div>
                          {new Date(
                            student.verification_sent_at,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    {/* <div>
                      <div className="text-gray-500 mb-1">Статус архива:</div>
                      <div
                        className={
                          student.archived ? "text-red-600" : "text-green-600"
                        }
                      >
                        {student.archived ? "В архиве" : "Не в архиве"}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          В классе нет учеников
        </div>
      )}
    </div>
  );
};

export default ClassList;
