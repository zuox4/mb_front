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
    <header className="text-md lg:text-2xl py-3 px-2 lg:px-20 w-full z-50 rounded-b-2xl bg-[#1B4E71] font-codec justify-between text-white flex flex-row items-end fixed top-0 left-0">
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
          <div
            className="
  w-full 
  
"
          >
            <div className="flex flex-col items-center md:flex-row md:items-start gap-5 py-10 ">
              {/* Аватар */}
              <div className="relative ">
                <Avatar className="w-28 h-28 md:w-24 md:h-24 overflow-hidden border-4 border-white/30 md:border-gray-100 shadow-xl">
                  <AvatarImage
                    src={image}
                    alt={display_name}
                    className="transform scale-110 object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-4xl text-white">
                    {getShortName(display_name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Информация */}
              <div className="flex-1 text-center md:text-left ">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-xl text-white md:text-gray-800">
                      {display_name}
                    </h3>
                    <p className="text-lg text-white/80 md:text-gray-600 mt-1">
                      {email}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span
                      className="
            px-3 py-1.5 
            bg-gradient-to-r from-sch-green-light to-green-500 
            text-white font-medium 
            rounded-full
            text-sm
          "
                    >
                      {getRoleDisplayName(role)}
                    </span>

                    {data?.class_name && (
                      <span
                        className="
              px-3 py-1.5 
              bg-blue-500/20 
              text-blue-300 md:text-blue-600 font-medium 
              rounded-full
              text-sm
            "
                      >
                        Класс: {data.class_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Разделитель */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent md:via-gray-200 my-4"></div>
          </div>

          {/* {data?.group_leader && (
            <GroupLeaderCard
              dispay_name={data.group_leader.display_name}
              image={data.group_leader.image || ""}
              max_url={data.group_leader.max_url || ""}
            />
          )} */}

          <DropdownMenuSeparator className="my-3 bg-gray-200" />
          {/* <div className="flex flex-col items-center mt-3"> */}
          {/* </div> */}
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
