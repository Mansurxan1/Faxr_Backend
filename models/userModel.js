import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Метод для проверки пароля
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Добавим отладочную информацию
  console.log('Сравнение паролей:', {
    entered: enteredPassword,
    hashed: this.password
  });
  return await bcrypt.compare(enteredPassword, this.password);
};

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
