import { motion } from "framer-motion";
import React from "react";
import { GroupListFilterProps } from "./filtres";

const GroupListFilter: React.FC<GroupListFilterProps> = ({
  groups,
  selectedGroupId,
  setGroupId,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        <h3 className="text-lg font-medium mb-3">Выберите класс:</h3>
        <div className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => setGroupId(group.id)}
              className={`
              cursor-pointer border-1 rounded-lg w-20 p-1 text-center transition-all
              ${
                selectedGroupId === group.id
                  ? "border-sch-green-light bg-sch-green-light bg-opacity-20 text-white"
                  : "border-sch-green-light  hover:bg-sch-blue-ultra hover:scale-103"
              }
            `}
            >
              <div className="font-medium text-center">{group.name}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupListFilter;
