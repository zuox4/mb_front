import React from "react";

interface ProfileLink {
  name: string;
  url: string;
  clickable: boolean;
  icon?: string;
}

const WelcomePage: React.FC = () => {
  const profiles: ProfileLink[] = [
    {
      name: "медицинский",
      url: "https://vk.com/wall-152579236_6338",
      clickable: true,
      icon: "🏥",
    },
    {
      name: "инженерный",
      url: "https://vk.com/wall-152579236_5749",
      clickable: true,
      icon: "⚙️",
    },
    {
      name: "IT",
      url: "https://t.me/info_1298/3469",
      clickable: true,
      icon: "💻",
    },
    {
      name: "медиа",
      url: "https://vk.com/wall-152579236_5589",
      clickable: true,
      icon: "🎬",
    },
    {
      name: "предпринимательский",
      url: "https://vk.com/wall-152579236?q=%23юныепредприниматели",
      clickable: true,
      icon: "💼",
    },
    {
      name: "архитектурный",
      url: "https://vk.com/wall-152579236_6114",
      clickable: true,
      icon: "🏛️",
    },
    {
      name: "гуманитарный и юридический",
      url: "#",
      clickable: false,
      icon: "📚",
    },
  ];

  const handleProfileClick = (profile: ProfileLink) => {
    if (profile.clickable) {
      window.open(profile.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-gradient-to-br from-sch-green to-sch-green-dark flex items-center justify-center  font-codec">
      <div className=" rounded-2xl   max-w-6xl w-full  transform transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl text-white md:text-4xl lg:text-5xl font-bold  mb-3 sm:mb-4">
            Зачетная книжка <br />
            Школа 1298 «Профиль Куркино»
          </h1>
          <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-sch-green-light to-sch-green-light/20 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
            Система доступна только ученикам 10-11 классов
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-base sm:text-lg md:text-xl uppercase text-white leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
            Приветствуем на странице зачетной книжки ученика Школы 1298 «Профиль
            Куркино». Пока система доступна только ученикам 10-11 классов.
          </p>
        </div>

        {/* Profiles Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-medium text-white text-center mb-6 sm:mb-8">
            Подробнее о профилях школы:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {profiles.map((profile, index) => (
              <div
                key={index}
                onClick={() => handleProfileClick(profile)}
                className={`
                  relative group p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
                  ${
                    profile.clickable
                      ? "border-gray-200 hover:border-sch-green hover:shadow-lg hover:scale-105 bg-white hover:bg-sch-green/5"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-70"
                  }
                `}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div
                    className={`
                    absolute -inset-full transform skew-x-12 transition-all duration-1000
                    ${profile.clickable ? "group-hover:inset-0 group-hover:skew-x-0" : ""}
                    ${profile.clickable ? "bg-gradient-to-r from-transparent via-white to-transparent" : ""}
                  `}
                  ></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-2 sm:space-y-3">
                  {/* Icon */}
                  {profile.icon && (
                    <div
                      className={`
                      text-2xl sm:text-3xl transition-transform duration-300
                      ${profile.clickable ? "group-hover:scale-110" : ""}
                    `}
                    >
                      {profile.icon}
                    </div>
                  )}

                  {/* Profile Name */}
                  <span
                    className={`
                    font-semibold text-sm sm:text-lg capitalize
                    ${profile.clickable ? "text-gray-800 group-hover:text-sch-green" : "text-gray-600"}
                  `}
                  >
                    {profile.name}
                  </span>

                  {/* Status */}
                  {profile.clickable ? (
                    <div className="flex items-center space-x-1 sm:space-x-2 text-sch-green font-medium text-xs sm:text-sm">
                      <span>Подробнее</span>
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="px-2 sm:px-3 py-1 bg-gray-500 text-white text-xs sm:text-sm font-medium rounded-full">
                      Скоро
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
          <p className="text-gray-500 text-xs sm:text-sm">
            Для получения доступа к системе обратитесь к классному руководителю
            или руководителю проектного оффиса
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
