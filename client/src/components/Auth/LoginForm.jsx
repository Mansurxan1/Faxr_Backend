import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData }));

      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      if (!err?.status) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.status === 400) {
        setErrMsg("Отсутствует email или пароль");
      } else if (err.status === 401) {
        setErrMsg("Неверный email или пароль");
      } else {
        setErrMsg("Ошибка входа");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>

      {errMsg && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert">
          <p>{errMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className="mb-6">
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
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <h3 className="text-center mt-4">
          Нет аккаунта?
          <Link to="/register" className="text-blue-500 hover:underline ml-2">
            Зарегистрироваться
          </Link>
        </h3>
      </form>
    </div>
  );
};

export default LoginForm;
