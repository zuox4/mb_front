const ModalPersonData = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div className="fixed inset-0 bg-sch-blue-dark bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Согласие на обработку персональных данных
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="text-gray-700 space-y-4">
            <p>
              Настоящим я даю согласие на обработку моих персональных данных в
              соответствии с Федеральным законом №152-ФЗ «О персональных данных»
              от 27.07.2006 года.
            </p>

            <div>
              <h3 className="font-semibold mb-2">
                1. Какие данные мы собираем:
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Фамилия, имя, отчество</li>
                <li>Контактные данные (email, телефон)</li>
                <li>Прочая информация, необходимая для предоставления услуг</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Цели обработки данных:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Регистрация учетной записи</li>
                <li>Предоставление доступа к сервису</li>
                <li>Обработка запросов и обращений</li>
                <li>Информирование о новых возможностях сервиса</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Условия обработки:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Обработка осуществляется с момента регистрации</li>
                <li>
                  Согласие может быть отозвано путем письменного уведомления
                </li>
                <li>Данные хранятся в течение срока действия учетной записи</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Нажимая кнопку «Зарегистрироваться», вы подтверждаете, что
              ознакомились с политикой обработки персональных данных и
              принимаете указанные условия.
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-sch-green-light text-white rounded hover:bg-amber-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPersonData;
