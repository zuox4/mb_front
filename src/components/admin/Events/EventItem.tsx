import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventItemProps {
  id: number;
  title: string;
  date?: string;
  participants?: number;
}

const EventItem = ({ id, title, date, participants }: EventItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`${id}`)}
      className="cursor-pointer group relative bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Левая часть с иконкой и названием */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className=" rounded-lg flex-shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-[16px] font-semibold text-white truncate">
            {title}
          </h3>
        </div>

        {/* Правая часть с датой и участниками */}
        {(date || participants) && (
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-shrink-0">
            {date && (
              <span className="whitespace-nowrap flex items-center gap-1">
                {date}
              </span>
            )}
            {participants && (
              <span className="whitespace-nowrap flex items-center gap-1">
                👥 {participants}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventItem;
