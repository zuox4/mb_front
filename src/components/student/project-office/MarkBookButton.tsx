import { BookMarked, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarkBookButton = () => {
  const navigate = useNavigate();
  const navToMarkBook = () => {
    navigate("/student/markBook");
  };
  return (
    <div
      onClick={navToMarkBook}
      className="flex lg:w-fit lg:h-15 lg:animate-[float_3s_ease-in-out_infinite] items-center justify-between w-full gap-3 px-4 py-3 lg:from-sch-green-light/20 lg:to-sch-green-light/70 bg-gradient-to-r cursor-pointer from-sch-green-light/30 to-sch-green-light/20 border border-sch-green-light rounded-2xl hover:from-sch-green-light/15 hover:to-sch-green-light/10 transition-all duration-300 group shadow-sm hover:shadow-md"
    >
      <div className="flex gap-2 items-center h-10">
        <BookMarked color="white" />
        <span className="font-codec-news text-m text-gray-400 lg:text-white">
          Зачетная книжка
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-sch-green-light lg:text-amber-50 group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

export default MarkBookButton;
