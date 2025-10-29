import { MoreHorizontal } from "lucide-react";

const MoreButton = ({ handleCardClick }: { handleCardClick: () => void }) => {
  return (
    <button
      onClick={handleCardClick}
      className="p-1 rounded-lg bg-gray-200/10 text-gray-300"
      title="Подробнее"
    >
      <MoreHorizontal className="w-5 h-5  text-white cursor-pointer" />
    </button>
  );
};

export default MoreButton;
