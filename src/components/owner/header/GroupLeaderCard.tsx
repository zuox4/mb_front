const GroupLeaderCard = ({
  dispay_name,
  image,
  max_url,
}: {
  dispay_name: string;
  image: string;
  max_url: string;
}) => {
  return (
    <div className="space-y-2 mt-5">
      <p className="text-sm font-medium lg:text-gray-700 text-white">
        Классный руководитель
      </p>

      <div
        className="flex items-center gap-3 p-3 rounded-xl
                     lg:bg-slate-800/40 lg:border lg:border-slate-700/50
                     bg-white border border-gray-200"
      >
        {/* Простой круглый аватар */}
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                       flex items-center justify-center overflow-hidden flex-shrink-0"
        >
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold">
              {dispay_name.charAt(0)}
            </span>
          )}
        </div>

        {/* Только имя */}
        <div className="flex-1">
          <h4 className="font-semibold lg:text-white text-gray-800">
            {dispay_name}
          </h4>
        </div>

        {/* Простая иконка */}
        <div className="text-blue-500 lg:text-blue-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span>{max_url}</span>
      </div>
    </div>
  );
};

export default GroupLeaderCard;
