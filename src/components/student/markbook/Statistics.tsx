import { type EventMark } from "@/hooks/student/useMarkBook";

interface StatisticsProps {
  marks: EventMark[];
}

function Statistics({ marks }: StatisticsProps) {
  const totalMarks = marks.length;
  const passedMarks = marks.filter((mark) => mark.type === "зачет").length;
  const failedMarks = marks.filter((mark) => mark.type === "незачет").length;

  // Статистика по этапам
  const totalStages = marks.reduce((acc, mark) => acc + mark.stages.length, 0);
  const passedStages = marks.reduce(
    (acc, mark) =>
      acc + mark.stages.filter((stage) => stage.status === "зачет").length,
    0
  );
  //   const stagePassRate = totalStages > 0 ? Math.round((passedStages / totalStages) * 100) : 0;

  // Общий средний балл

  return (
    <div className="grid grid-cols-1  md:grid-cols-4 gap-4 mb-8">
      {/* Всего мероприятий */}
      <div className="bg-white/10  rounded-xl p-1 items-center md:p-4 border border-gray-200/30 backdrop-blur-sm lg:block pr-2 md:pr-0">
        <div className="text-center md:block grid grid-cols-[1fr_3fr_1fr] items-center">
          <div className="flex justify-center items-center md:mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="font-codec text-white/80 text-sm mb-1">
            Всего мероприятий
          </p>
          <p className="font-codec-bold text-2xl text-white">{totalMarks}</p>
        </div>
      </div>

      {/* Зачеты */}
      <div className="bg-white/10  rounded-xl p-1 items-center md:p-4 border border-gray-200/30 backdrop-blur-sm lg:block pr-2 md:pr-0">
        <div className="text-center md:block grid grid-cols-[1fr_3fr_1fr] items-center">
          {" "}
          <div className="flex justify-center items-center md:mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="font-codec text-white/80 text-sm mb-1">Зачеты</p>
          <p className="font-codec-bold text-2xl text-green-400">
            {passedMarks}
          </p>
          {/* <p className="font-codec text-green-400/80 text-xs mt-1">
            {passRate}%
          </p> */}
        </div>
      </div>

      {/* Незачеты */}
      <div className="bg-white/10  rounded-xl p-1 items-center md:p-4 border border-gray-200/30 backdrop-blur-sm lg:block pr-2 md:pr-0">
        <div className="text-center md:block grid grid-cols-[1fr_3fr_1fr] items-center">
          {" "}
          <div className="flex justify-center items-center lg:mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="font-codec text-white/80 text-sm mb-1">Незачеты</p>
          <p className="font-codec-bold text-2xl text-red-400">{failedMarks}</p>
          {/* <p className="font-codec text-red-400/80 text-xs mt-1">
            {100 - passRate}%
          </p> */}
        </div>
      </div>

      {/* Успеваемость */}
      <div className="bg-white/10  rounded-xl p-1 items-center md:p-4 border border-gray-200/30 backdrop-blur-sm lg:block pr-2 md:pr-0">
        <div className="text-center md:block grid grid-cols-[1fr_3fr_1fr] items-center">
          {" "}
          <div className="flex justify-center items-center md:mb-2">
            <div className="w-10 h-10 bg-sch-green-light/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-sch-green-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <p className="font-codec text-white/80 text-sm mb-1">Успеваемость</p>
          {/* <p className="font-codec-bold text-2xl text-sch-green-light">
            {averageScore}%
          </p> */}
          <p className="font-codec text-sch-green-light/80 text-xs mt-1">
            {passedStages}/{totalStages} этапов
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
