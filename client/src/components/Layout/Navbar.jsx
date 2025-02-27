import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAdmin,
  clearCredentials,
} from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../features/auth/authApiSlice";

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Faxr Travel
          </Link>

          {/* Гамбургер-меню для мобильных устройств */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Навигационные ссылки для десктопа */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-200 transition">
              Главная
            </Link>

            {user ? (
              <>
                <Link
                  to="/bookings/my-bookings"
                  className="hover:text-blue-200 transition">
                  Мои бронирования
                </Link>

                <Link to="/profile" className="hover:text-blue-200 transition">
                  Мой профиль
                </Link>

                {isAdmin && (
                  <div className="relative group">
                    <button
                      onClick={toggleAdminMenu}
                      className="flex items-center hover:text-blue-200 transition cursor-pointer">
                      Администрирование
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isAdminMenuOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ">
                        <Link
                          to="/admin/tours/new"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                          Создать тур
                        </Link>
                        <Link
                          to="/"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                          Управление турами
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white font-semibold bg-yellow-50">
                          Управление бронированиями
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition">
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md transition">
                Войти
              </Link>
            )}
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/"
              className="block py-2 hover:text-blue-200 transition"
              onClick={() => setIsMenuOpen(false)}>
              Главная
            </Link>

            {user ? (
              <>
                <Link
                  to="/bookings/my-bookings"
                  className="block py-2 hover:text-blue-200 transition"
                  onClick={() => setIsMenuOpen(false)}>
                  Мои бронирования
                </Link>

                <Link
                  to="/profile"
                  className="block py-2 hover:text-blue-200 transition"
                  onClick={() => setIsMenuOpen(false)}>
                  Мой профиль
                </Link>

                {isAdmin && (
                  <>
                    <div className="border-t border-blue-500 my-2"></div>
                    <div className="font-semibold py-1 text-blue-200">
                      Админ-панель:
                    </div>

                    <Link
                      to="/admin/tours/new"
                      className="block py-2 pl-4 hover:text-blue-200 transition"
                      onClick={() => setIsMenuOpen(false)}>
                      Создать тур
                    </Link>

                    <Link
                      to="/"
                      className="block py-2 pl-4 hover:text-blue-200 transition"
                      onClick={() => setIsMenuOpen(false)}>
                      Управление турами
                    </Link>

                    <Link
                      to="/admin/bookings"
                      className="block py-2 pl-4 hover:text-blue-200 transition bg-yellow-600 text-white px-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}>
                      Управление бронированиями
                    </Link>
                    <div className="border-t border-blue-500 my-2"></div>
                  </>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-red-300 transition">
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 hover:text-blue-200 transition"
                onClick={() => setIsMenuOpen(false)}>
                Войти
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
