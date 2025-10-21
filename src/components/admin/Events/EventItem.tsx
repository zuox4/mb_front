import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventItemProps {
  id: number;
  title: string;
}

const EventItem = ({ id, title }: EventItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between w-80 bg-amber-50 p-2 items-center rounded">
      <div className="">
        <h1 className="font-codec">{title}</h1>
        {/* <span className="text-gray-500">Описание мероприятия</span> */}
      </div>
      <div>
        <span
          className="underline cursor-pointer"
          onClick={() => navigate(`${id}`)}
        >
          <MoreHorizontal />
        </span>
      </div>
    </div>
  );
};

export default EventItem;
