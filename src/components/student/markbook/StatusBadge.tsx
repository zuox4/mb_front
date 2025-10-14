import { Crown } from "lucide-react";

// Компонент бейджа статуса
export interface StatusBadgeProps {
  status: "зачет" | "незачет";
  text: string;
  size?: "sm" | "md";
  result_title?: string | null;
}

function StatusBadge({
  status,
  text,
  size = "md",
  result_title,
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <>
      {!result_title && (
        <span
          className={`font-codec-bold rounded-full ${sizeClasses[size]} ${
            status === "зачет"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {text === "незачет" ? "незачет" : "Зачет"}
        </span>
      )}
      {result_title && (
        <div
          className={`flex text-white items-center gap-2 bg-sch-green-light rounded-full font-codec-bold ${sizeClasses[size]}`}
        >
          <span className="">{result_title}</span>
          <Crown />
        </div>
      )}
    </>
  );
}
export default StatusBadge;
