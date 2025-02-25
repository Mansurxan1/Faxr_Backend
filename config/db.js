import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      ssl: true,
      sslValidate: true,
      family: 4
    });
    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Проверьте:');
      console.error('1. Доступность интернет-соединения');
      console.error('2. Правильность строки подключения');
      console.error('3. Статус MongoDB Atlas');
    }
    process.exit(1);
  }
};

export default connectDB;
