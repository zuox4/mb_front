import NavBar from "@/components/admin/NavBar";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="w-full">
      <div className="flex">
        <NavBar />
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
