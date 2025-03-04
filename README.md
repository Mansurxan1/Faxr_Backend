# ClickPay Tours

Проект туристического агентства с возможностью бронирования туров.

## Технологии

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Redux Toolkit, React Router, TailwindCSS
- **Аутентификация**: JWT, bcrypt

## Структура проекта

Проект имеет следующую структуру:

- `/` - корневая директория с бэкенд-кодом
- `/client` - фронтенд на React

## Установка

1. Клонируйте репозиторий:
```bash
git clone <URL репозитория>
cd clickPay
```

2. Установите зависимости для бэкенда:
```bash
npm install
```

3. Установите зависимости для фронтенда:
```bash
cd client
npm install
cd ..
```

4. Создайте файл `.env` в корне проекта со следующими переменными:
```
PORT=5001
MONGODB_URI=<Ваша строка подключения к MongoDB>
JWT_SECRET=<ваш секретный ключ для JWT>
JWT_EXPIRES_IN=90d
```

## Запуск проекта

### Режим разработки
Для одновременного запуска бэкенда и фронтенда:
```bash
npm run dev
```

### Запуск только бэкенда
```bash
npm run server
```

### Запуск только фронтенда
```bash
npm run client
```

### Для продакшна
```bash
npm run build  # сборка фронтенда
npm start      # запуск сервера
```

## Функциональность

- Регистрация и аутентификация пользователей
- Просмотр списка доступных туров
- Бронирование туров
- Просмотр личных бронирований
- Панель администратора для управления турами и бронированиями

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход пользователя
- `POST /api/auth/logout` - Выход пользователя
- `GET /api/auth/profile` - Получение профиля текущего пользователя
- `PUT /api/auth/update-password` - Обновление пароля пользователя

### Туры
- `GET /api/tours` - Получение всех туров
- `GET /api/tours/:id` - Получение тура по ID
- `POST /api/tours` - Создание нового тура (только для админа)
- `PUT /api/tours/:id` - Обновление тура (только для админа)
- `DELETE /api/tours/:id` - Удаление тура (только для админа)
- `GET /api/tours/:id/image` - Получение изображения тура

### Бронирования
- `GET /api/bookings` - Получение всех бронирований (только для админа)
- `GET /api/bookings/my-bookings` - Получение бронирований текущего пользователя
- `GET /api/bookings/:id` - Получение бронирования по ID
- `POST /api/bookings` - Создание нового бронирования
- `PUT /api/bookings/:id/status` - Обновление статуса бронирования (только для админа)
- `DELETE /api/bookings/:id` - Удаление бронирования (только для админа) 