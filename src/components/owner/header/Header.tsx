import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth";
import { useStudentData } from "@/hooks/student/useStudentData";
import { useUserData } from "@/hooks/user/useUserData";

const Header = () => {
  const { user } = useAuth();
  const { data: userData, isLoading, isError } = useUserData(user?.id);
  const { logout } = useAuth();
  const { data } = useStudentData();

  // Если данные загружаются или произошла ошибка, показываем упрощенный header
  if (isLoading) {
    return <SkeletonHeader />;
  }

  if (isError || !userData) {
    return <BasicHeader />;
  }

  const { display_name, email, roles, image } = userData;
  const role = Array.isArray(roles) ? roles[0] : roles;

  const getShortName = (name: string) =>
    name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      teacher: "Сотрудник",
      student: "Ученик",
      admin: "Администратор",
    };
    return roleMap[role] || "Нет информации о роли";
  };

  return (
    <header className="text-md lg:text-2xl py-2 px-2 h-20 lg:px-20 w-full z-50 rounded-b-2xl bg-[#1B4E71] font-codec justify-between text-white flex flex-row items-end fixed top-0 left-0">
      <h1 className="uppercase border-b-2 border-sch-green-light">
        Зачетная книжка обучающегося
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none">
          <span className="hidden lg:block text-lg font-codec-news">
            {display_name}
          </span>
          <Avatar className="w-9 h-9 overflow-hidden">
            <AvatarImage
              src={image}
              alt={display_name}
              className="transform scale-110 object-cover w-full h-full"
            />
            <AvatarFallback className="bg-sch-green-light text-xl text-white">
              {getShortName(display_name)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="lg:bg-white backdrop-blur-lg flex flex-col items-center rounded-none h-screen w-screen  top-0 px-3 lg:w-100 lg:h-fit border-0 lg:rounded-2xl text-white lg:text-black">
          <div className="flex flex-col items-center space-y-3 mt-10">
            <Avatar className="w-30 h-30 overflow-hidden">
              <AvatarImage
                src={image}
                alt={display_name}
                className="transform scale-110 object-cover w-full h-full"
              />
              <AvatarFallback className="bg-sch-green-light text-5xl text-white">
                {getShortName(display_name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center flex flex-col items-center gap-3">
              <h3 className="font-codec text-xl">{display_name}</h3>
              <p className="font-codec-news text-lg text-white md:text-gray-600">
                {email}
              </p>
              <p className=" font-codec-news px-2 bg-sch-green-light text-white w-fit rounded">
                {getRoleDisplayName(role)} {data?.class_name}
              </p>
            </div>
          </div>
          {data?.group_leader && (
            <div className="text-white lg:text-gray-700 text-left w-full mt-2">
              Классный руководитель:
              <br /> {data.group_leader.display_name}
            </div>
          )}
          <DropdownMenuSeparator className="my-3 bg-gray-200" />

          <Button
            variant="ghost"
            onClick={logout}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Выйти
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

// Компоненты для состояний загрузки и ошибки
const SkeletonHeader = () => (
  <header className="text-md lg:text-2xl py-2 px-2 h-20 lg:px-20 w-full z-50 rounded-b-2xl bg-[#1B4E71] font-codec justify-between text-white flex flex-row items-end fixed top-0 left-0">
    <h1 className="uppercase border-b-2 border-sch-green-light">
      Зачетная книжка обучающегося
    </h1>
    <div className="flex items-center gap-3">
      <div className="hidden lg:block w-24 h-4 bg-gray-400 rounded animate-pulse" />
      <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse" />
    </div>
  </header>
);

const BasicHeader = () => (
  <header className="text-md lg:text-2xl py-2 px-2 h-20 lg:px-20 w-full z-50 rounded-b-2xl bg-[#1B4E71] font-codec justify-between text-white flex flex-row items-end fixed top-0 left-0">
    <h1 className="uppercase border-b-2 border-sch-green-light">
      Зачетная книжка обучающегося
    </h1>
    <Avatar className="rounded-full">
      <AvatarFallback className="bg-sch-green-light">?</AvatarFallback>
    </Avatar>
  </header>
);

export default Header;
