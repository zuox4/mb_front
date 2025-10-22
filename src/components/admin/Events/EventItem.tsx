import { Calendar, MoreHorizontal } from "lucide-react";
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
    <div className="group relative w-100 bg-gradient-to-r from-sch-green-light/40 to-sch-green-light/20 hover:from-sch-green-light/50 hover:to-sch-green-light/30 hover:shadow-lg transition-all duration-300 rounded-xl p-4 border border-sch-green-light/30">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 items-center flex">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-codec-news text-white  truncate ">{title}</h3>
          </div>

          {(date || participants) && (
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {date && <span className="flex items-center gap-1">{date}</span>}
              {participants && (
                <span className="flex items-center gap-1">
                  👥 {participants}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`${id}`)}
          className="ml-3 p-2 rounded-lg bg-gray-200/10 text-gray-300"
          title="Подробнее"
        >
          <MoreHorizontal className="w-5 h-5  text-white cursor-pointer" />
        </button>
      </div>

      {/* Акцентная полоска */}
    </div>
  );
};

export default EventItem;
