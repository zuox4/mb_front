import BackButton from "../student/markbook/BackButton";

const NotFoundInfo = () => {
  return (
    <div className="w-full flex flex-col items-center text-white font-codec text-2xl text-center">
      <h1>Данный раздел пока недоступен для вас</h1>
      <BackButton path={"/"} title="Домой" />
    </div>
  );
};

export default NotFoundInfo;
