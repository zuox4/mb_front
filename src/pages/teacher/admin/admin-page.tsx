import { Link, Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div>
      <h1 className="text-2xl text-white text-center">
        Панель администрирования
      </h1>
      <div className="project_offices">
        <Link to={"event-types"} className="underline text-2xl text-white ">
          Менеджер типов мероприятий
        </Link>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
