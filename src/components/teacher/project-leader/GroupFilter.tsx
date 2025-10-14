// components/project-office/GroupFilter.tsx
import React from "react";

interface Group {
  id: number;
  name: string;
  student_count: number;
}

interface GroupFilterProps {
  groups: Group[];
  selectedGroups: string[];
  onGroupsChange: (groups: string[]) => void;
}

const GroupFilter: React.FC<GroupFilterProps> = ({
  groups,
  selectedGroups,
  onGroupsChange,
}) => {
  const handleGroupToggle = (groupName: string) => {
    if (selectedGroups.includes(groupName)) {
      onGroupsChange(selectedGroups.filter((g) => g !== groupName));
    } else {
      onGroupsChange([...selectedGroups, groupName]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">Фильтр по классам</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => handleGroupToggle(group.name)}
            className={`
              px-3 py-2 rounded-lg border transition-all text-sm
              ${
                selectedGroups.includes(group.name)
                  ? "bg-sch-green-light text-white border-sch-green-light"
                  : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
              }
            `}
          >
            {group.name}
            <span className="text-xs ml-2 opacity-70">
              ({group.student_count})
            </span>
          </button>
        ))}
      </div>

      {selectedGroups.length > 0 && (
        <div className="text-sm text-gray-400 mt-2">
          Выбрано: {selectedGroups.length} класс(ов)
        </div>
      )}
    </div>
  );
};

export default GroupFilter;
