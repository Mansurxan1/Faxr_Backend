import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [showAdminField, setShowAdminField] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, passwordConfirm, adminSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка паролей
    if (password !== passwordConfirm) {
      setErrMsg("Пароли не совпадают");
      return;
    }

    try {
      // Добавляем adminSecret в запрос, только если поле заполнено
      const userData = await register({ 
        name, 
        email, 
        password,
        ...(adminSecret ? { adminSecret } : {})
      }).unwrap();

      // После успешной регистрации сразу входим в систему, как при успешном логине
      dispatch(setCredentials({ ...userData }));
      
      // Очищаем форму
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setAdminSecret("");

      // Перенаправляем на главную страницу
      navigate("/");
    } catch (err) {
      console.log(err);
      
      if (!err?.status) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.status === 400) {
        setErrMsg(err.data?.message || "Некорректные данные регистрации");
      } else if (err.status === 409) {
        setErrMsg("Пользователь с таким email уже существует");
      } else {
        setErrMsg(err.data?.message || "Ошибка регистрации");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      {errMsg && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert">
          <p>{errMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Имя
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
            minLength={8}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="passwordConfirm"
            className="block text-gray-700 font-bold mb-2">
            Подтверждение пароля
          </label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
            minLength={8}
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAdminField}
                onChange={() => setShowAdminField(!showAdminField)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm text-gray-600">Регистрация как администратор</span>
            </label>
          </div>
        </div>

        {showAdminField && (
          <div className="mb-4">
            <label htmlFor="adminSecret" className="block text-gray-700 font-bold mb-2">
              Секретный код администратора
            </label>
            <input
              type="password"
              id="adminSecret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Введите секретный код"
            />
            <p className="text-xs text-gray-500 mt-1">
              Требуется для получения прав администратора
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline mb-4"
          disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?
            <Link to="/login" className="text-blue-500 hover:text-blue-700 ml-1">
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
