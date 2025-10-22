import AddEventTypeForm from "@/components/admin/EventType/EventTypeform/AddEventTypeForm";
import BackButton from "@/components/student/markbook/BackButton";

const CreateEventTypePage = () => {
  return (
    <div>
      <div className="flex">
        <BackButton path="/teacher/admin/event-types" title="Назад" />
        <h1 className="text-center flex-2  font-codec text-2xl text-white">
          Форма создания типа мероприятия
        </h1>
      </div>

      <AddEventTypeForm />
    </div>
  );
};

export default CreateEventTypePage;
