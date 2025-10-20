import EventList from "@/components/admin/Events/EventList";

const EventsPage = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-white font-codec text-2xl mb-6">
        Страница с мероприятиями
      </h1>
      {/* <div>
        <CreateEventModal />
      </div> */}

      <EventList />
    </div>
  );
};

export default EventsPage;
