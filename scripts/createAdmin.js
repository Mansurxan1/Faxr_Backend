import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from "bcryptjs";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({}); // Очищаем коллекцию пользователей

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('your_secure_password', salt);

    await User.create({
      email: 'admin@example.com',
      password: hashedPassword
    });

    console.log('Администратор успешно создан');
    process.exit();
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
};

createAdmin(); 