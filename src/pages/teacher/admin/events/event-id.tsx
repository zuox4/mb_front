import { useParams } from "react-router-dom";

const EventPageById = () => {
  const { id } = useParams();
  return (
    <div>
      Дашборд со все йстатистикой для мероприятия <span>{id}</span>
    </div>
  );
};

export default EventPageById;
