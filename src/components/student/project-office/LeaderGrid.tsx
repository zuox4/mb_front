import TeacherProfile from "./TeacherProfile";
interface BaseLeader {
  display_name: string;
  about: string | null;
  image: string | null;
  email: string | null;
  max_url: string | null;
}
interface LeaderGridProps {
  project_leader?: BaseLeader | null;
  className?: string;
  fallbackText?: string;
}

const LeaderGrid = ({
  project_leader,

  className = "",
  fallbackText = "Пока нет никакой информации",
}: LeaderGridProps) => {
  if (!project_leader) {
    return null;
  }

  return (
    <div
      className={`flex flex-col md:grid md:grid-cols-2 gap-6 max-w-7xl mx-auto ${className}`}
    >
      <TeacherProfile
        displayName={project_leader.display_name}
        image={project_leader.image || ""}
        variant="project_leader"
        about={project_leader.about || fallbackText}
      />
    </div>
  );
};

export default LeaderGrid;
