// components/CreateEventTypeButton.tsx
import React from "react";

interface CreateEventTypeButtonProps {
  onClick: () => void;
  className?: string;
}

const CreateEventTypeButton: React.FC<CreateEventTypeButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-sch-green-light text-white rounded-lg hover:bg-sch-green-light/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2 ${className}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>Создать тип мероприятия</span>
    </button>
  );
};

export default CreateEventTypeButton;
