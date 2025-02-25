import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from './app.js';

// Загружаем переменные окружения до использования
dotenv.config();

console.log('Попытка подключения к:', process.env.MONGODB_URI); // Добавим для отладки

const port = process.env.PORT || 5001;

// Подключение к базе данных
connectDB();

// Запуск сервера
app.listen(port, () => console.log(`Server running on port: ${port}`));

// Обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  console.error('Необработанная ошибка:', err);
  process.exit(1);
});
