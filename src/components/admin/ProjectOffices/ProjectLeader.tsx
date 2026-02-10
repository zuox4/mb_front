import { Clock, Mail, Phone, User } from "lucide-react";
import { Teacher } from "./ProjectOfficeAdminPage";
const ProjectLeader = ({ teacher }: { teacher: Teacher }) => {
  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "Никогда";

    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) {
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60),
      );
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60),
        );
        if (diffInMinutes < 1) return "Только что";
        return `${diffInMinutes} мин. назад`;
      }
      return `${diffInHours} час. назад`;
    } else if (diffInDays === 1) {
      return "Вчера";
    } else if (diffInDays < 7) {
      return `${diffInDays} дн. назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/20">
            {teacher.image ? (
              <img
                src={teacher.image}
                alt={teacher.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-white/60" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-medium text-white/70 mb-2">
            Руководитель проекта
          </h2>
          <h3 className="text-3xl font-bold text-white mb-6">
            {teacher.display_name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-500/30">
                <Phone className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Телефон</p>
                <p className="font-medium text-white">{teacher.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center border border-emerald-500/30">
                <Mail className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="font-medium text-white">{teacher.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 backdrop-blur-sm flex items-center justify-center border border-amber-500/30">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Последний вход</p>
                <p className="font-medium text-white">
                  {formatRelativeTime(teacher.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectLeader;
