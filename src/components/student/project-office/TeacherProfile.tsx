import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface TeacherProfileProps {
  displayName: string;
  about?: string;
  image?: string;
  variant: "group_leader" | "project_leader";
}

const TeacherProfile = ({
  displayName,
  about,
  image,
  variant,
}: TeacherProfileProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shortName = displayName
    .split(" ")
    .map((c) => c.charAt(0))
    .join("");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  const renderFormattedContent = () => {
    if (!about) return null;
    return <div dangerouslySetInnerHTML={{ __html: about }} />;
  };
  const title =
    variant === "project_leader"
      ? "Руководитель проекта"
      : "Классный руководитель";

  // Мобильная версия (раскрывающийся список)
  const mobileView = (
    <div className="border-1  bg-sch-blue-dark/40 rounded-2xl lg:hidden">
      {/* Заголовок - всегда видим */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <Avatar className="w-12 h-12 rounded-lg flex-shrink-0">
          <AvatarImage src={image} alt={displayName} className="object-cover" />
          <AvatarFallback className="bg-gray-700">{shortName}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] uppercase text-sch-green-light font-codec-bold">
            {title}
          </div>
          <div className="text-[14px] truncate">{displayName}</div>
        </div>
        <div className="flex-shrink-0">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Раскрывающееся содержимое */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-600 pt-3">
          <div className="text-[14px] text-justify uppercase font-codec-news">
            {renderFormattedContent()
              ? renderFormattedContent()
              : "Информация о пользователе не предоставлена"}
          </div>
        </div>
      )}
    </div>
  );

  // Десктопная версия (без изменений)
  const desktopView = (
    <div className="hidden min-w-[450px] h-fit lg:flex flex-col gap-3 border-1 border-sch-green-light relative bg-sch-blue-dark/40 p-4 lg:flex-row lg:p-5 rounded-2xl lg:bg-sch-blue-dark/10">
      <div className="flex justify-center lg:absolute -right-3 -top-5">
        <Avatar
          className={`rounded-lg w-full max-w-[200px] h-[200px] lg:w-30 lg:h-30 lg:ring-2 ring-white lg:rounded-full flex-shrink-0`}
        >
          <AvatarImage
            src={image}
            alt={displayName}
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-gray-700">{shortName}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col font-codec gap-2">
        <span className="text-[14px] uppercase border-b-2 border-sch-green-light w-fit lg:text-lg font-codec-bold">
          {title}
        </span>
        <span className="text-[17px] mt-2 w-fit">{displayName}</span>
        <span
          className={`font-codec-news text-justify w-fit text-[14px] lg:text-[16px] uppercase`}
        >
          {renderFormattedContent()
            ? renderFormattedContent()
            : "Информация о пользователе не предоставлена"}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  );
};

export default TeacherProfile;
