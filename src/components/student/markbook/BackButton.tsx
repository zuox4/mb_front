import { Link } from "react-router-dom";
interface BackButtonProps {
  title: string;
  path: string;
}
function BackButton({ path, title }: BackButtonProps) {
  return (
    <Link
      to={path}
      className="w-fit inline-flex items-center gap-2 mb-8 px-4 py-2 text-white  shadow-sm hover:shadow-md transition-all duration-300 border-b-2 border-sch-green-light hover:border-sch-green-light group"
    >
      <svg
        className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-codec font-medium text-white">{title}</span>
    </Link>
  );
}
export default BackButton;
