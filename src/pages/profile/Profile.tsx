import { useStudentData } from "@/hooks/student/useStudentData";
import { User, School, PersonStanding } from "lucide-react";

const ProfilePage = () => {
  const { data } = useStudentData();

  // Данные пользователя

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-md mx-auto">
        {/* Заголовок */}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <PersonStanding className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Профиль</h1>
            <p className="text-white/60 text-sm">Ваши данные</p>
          </div>
        </div>

        {/* Основная информация */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Аватар */}
            <div
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                          flex items-center justify-center"
            >
              <User className="w-8 h-8 text-white/40" />
            </div>

            {/* ФИО */}
            <div>
              <h2 className="text-xl font-bold text-white">
                {data?.display_name}
              </h2>
              <div className="text-white/60 text-sm">
                {data?.class_name} класс
              </div>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <School className="w-4 h-4 text-white/60" />
              <span>
                Классный руководитель: <br />
                {data?.group_leader?.display_name}
              </span>
            </div>
          </div>
        </div>

        {/* Статистика
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-white font-medium">Статистика</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Место в рейтинге</span>
              <span className="text-white font-medium">
                {userData.rank} из {userData.totalStudents}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Классный руководитель</span>
              <span className="text-white">{userData.classTeacher}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Email руководителя</span>
              <span className="text-white text-sm">
                {userData.classTeacherEmail}
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
