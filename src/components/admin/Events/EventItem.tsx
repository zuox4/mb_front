import { MoreHorizontal, Calendar } from "lucide-react";
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
    <div className="group relative w-80 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100   p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-codec text-gray-900  truncate ">{title}</h3>
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
          className="ml-3 p-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-sch-green-light/20 text-gray-400 hover:text-amber-600 transition-colors duration-200 group-hover:scale-110 transform"
          title="Подробнее"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Акцентная полоска */}
    </div>
  );
};

export default EventItem;
