import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Импорт компонентов
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';
import TourList from './components/Tours/TourList';
import BookingForm from './components/Bookings/BookingForm';
import BookingList from './components/Admin/BookingList';
import TourForm from './components/Admin/TourForm';
import MyBookings from './components/Bookings/MyBookings';
import RegistrationForm from './components/Auth/RegistrationForm';
import AutoLogin from './components/Auth/AutoLogin';
import AdminRoute from './components/Routes/AdminRoute';
import AccessDenied from './components/UI/AccessDenied';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AutoLogin />
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-8 px-4">
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<TourList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              
              {/* Маршруты для авторизованных пользователей */}
              <Route path="/tours/:id/book" element={<BookingForm />} />
              <Route path="/bookings/my-bookings" element={<MyBookings />} />
              
              {/* Маршруты для администраторов - защищенные с помощью AdminRoute */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/bookings" element={<BookingList />} />
                <Route path="/admin/tours/new" element={<TourForm />} />
                <Route path="/admin/tours/:id/edit" element={<TourForm />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App; 