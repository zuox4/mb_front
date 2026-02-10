import { useStudentData } from "@/hooks/student/useStudentData";
import { STATIC_BASE_URL } from "@/services/api/api";
import MarkBookButton from "./MarkBookButton";
import ProjectEvents from "./ProjectEvents";
import TeacherProfile from "./TeacherProfile";
import { Smile } from "lucide-react";

interface ProjectDashBoardProps {
  title?: string;
  description?: string;
  logo_url?: string;
}

const ProjectDashBoard = ({
  title,
  description,
  logo_url,
}: ProjectDashBoardProps) => {
  const { data } = useStudentData();
  if (!data) return null;

  return (
    <div className="lg:p-6">
      {/* Верхний блок без изменений */}
      <div className="flex flex-col lg:flex-col gap-6 lg:gap-8">
        {/* Блок с фото - всегда сверху */}
        <div className="w-full flex justify-between">
          <div className="w-full max-w-xs lg:max-w-full lg:w-1/4">
            <img
              src={STATIC_BASE_URL + logo_url}
              alt="Инженерный класс"
              className="w-full object-cover rounded-2xl lg:rounded-3xl"
            />
          </div>

          {/* Кнопка открыть зачетную книжку */}
          <div className="hidden lg:block">
            <MarkBookButton />
          </div>
        </div>

        {/* Основной контент */}
        <div className="lg:flex-1 lg:flex lg:flex-col">
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Белый заголовок */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Smile className="w-6 h-6 text-sch-green-light" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Добро пожаловать в {title}
                </h1>
                <p className="text-white/60 text-sm">
                  Школа 1298 "Профиль "Куркино"
                </p>
              </div>
            </div>
            {/* Учитель - 50% */}
            <div className="md:max-w-[50%]">
              {data.project_leader && (
                <TeacherProfile
                  displayName={data.project_leader.display_name}
                  image={data.project_leader.image || ""}
                  variant="project_leader"
                  about={data.project_leader.about || "Пока нет информации"}
                />
              )}
            </div>

            {/* Белый текст описания */}
            <p className="font-codec-news text-[15px] lg:text-xl xl:text-lg leading-relaxed text-justify text-white">
              {description}
            </p>
            <div className="lg:hidden gap-3 flex flex-col">
              <MarkBookButton />
            </div>
            {/* Блок с учителем и мероприятиями 1:1 */}
            <div className="grid md:grid-cols-1  gap-5 md:gap-20 my-2">
              <div>
                <ProjectEvents />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashBoard;
