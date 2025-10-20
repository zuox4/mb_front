import { HomeIcon } from "lucide-react";

import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-2xl text-white font-codec text-center py-20">
        Страница к которой вы обращаетесь не найдена
      </h1>
      <div className="flex flex-col items-center">
        <img src={"/sad.svg"} className="h-30 mb-10" />
      </div>
      <div className="w-full gap-4 flex items-center justify-center">
        <HomeIcon className="text-white" />
        <Link to={"/"} className="text-center text-white underline">
          На главную страницу
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
