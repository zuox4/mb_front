import { useStudentData } from "@/hooks/student/useStudentData";
import { STATIC_BASE_URL } from "@/services/api/api";
import MarkBookButton from "./MarkBookButton";
import ProjectEvents from "./ProjectEvents";
import TeacherProfile from "./TeacherProfile";

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
            <h1 className="uppercase text-[18px] md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
              Добро пожаловать,{" "}
              <span className="text-sch-green-light">{data.display_name}</span>
              <br className="" /> в {title}
            </h1>

            <div className="lg:hidden gap-3 flex flex-col">
              <MarkBookButton />
            </div>

            {/* Белый текст описания */}
            <p className="font-codec-news text-[15px] lg:text-xl xl:text-lg leading-relaxed text-justify text-white">
              {description}
            </p>

            {/* Блок с учителем и мероприятиями 1:1 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5 md:gap-20 my-2">
              {/* Учитель - 50% */}

              {data.project_leader && (
                <TeacherProfile
                  displayName={data.project_leader.display_name}
                  image={data.project_leader.image || ""}
                  variant="project_leader"
                  about={
                    data.project_leader.about || "Пока нет никакой информации"
                  }
                />
              )}

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
