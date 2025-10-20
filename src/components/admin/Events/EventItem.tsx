const EventItem = () => {
  return (
    <div className="grid grid-cols-[5fr_1fr] bg-amber-50 p-3 items-center rounded">
      <div className="w-full">
        <h1 className="font-codec">ВСОШ по Информатике</h1>
        <span className="text-gray-500">Описание мероприятия</span>
      </div>
      <div>
        <span className="underline">Подробнее</span>
      </div>
    </div>
  );
};

export default EventItem;
