import CreateGroupForm from "@/components/admin/Groups/CreateGroupModal";
import GroupsList from "@/components/admin/Groups/GroupsList";
import Header from "@/components/admin/Groups/Header";

const GroupsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex items-center mb-6">
        <Header />
      </div>
      <div>
        <CreateGroupForm />
        <GroupsList />
      </div>
    </div>
  );
};

export default GroupsPage;
