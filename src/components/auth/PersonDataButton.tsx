import { useState } from "react";
import ModalPersonData from "./ModalPersonData";

const ConfirmPersonData = ({
  isChecked,
  setIsChecked,
}: {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="personal-data"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          htmlFor="personal-data"
          className="text-sm text-white cursor-pointer"
        >
          Нажимая кнопку зарегистрироваться, я подтверждаю согласие на обработку
          моих{" "}
          <span
            className="text-amber-600 hover:text-amber-500 cursor-pointer underline"
            onClick={openModal}
          >
            персональных данных
          </span>
        </label>
      </div>

      {isModalOpen && <ModalPersonData closeModal={closeModal} />}
    </>
  );
};

export default ConfirmPersonData;
