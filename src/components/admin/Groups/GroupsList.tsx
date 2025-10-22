import Loader from "@/components/owner/Loader";
import { useGroups } from "@/hooks/admin/useAdminGroups";
import GroupCard from "./GroupCard";

const GroupsList = () => {
  const { data, isLoading } = useGroups();
  if (isLoading) return <Loader />;
  return (
    <div className="flex flex-wrap gap-3 mt-7">
      {data?.map((group) => (
        <GroupCard group={group} key={group.id} />
      ))}
    </div>
  );
};

export default GroupsList;
