import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import validateEmail from "../utils/validateEmail.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Секретный код для админа
const ADMIN_CODE = "12345";

// Регистрация (создание первого пользователя)
export const register = asyncHandler(async (req, res) => {
  const { email, password, adminSecret } = req.body;

  // Валидация email
  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Неверный формат email");
  }

  // Проверяем, не занят ли email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email уже используется");
  }

  // Проверяем секретный код для админа
  const isAdmin = adminSecret === ADMIN_CODE;

  // Создаем пользователя
  const user = await User.create({
    email,
    password,
    role: isAdmin ? "admin" : "user",
    isAdmin: isAdmin,
  });

  if (user) {
    createToken(res, user._id);
    res.status(201).json({
      status: "success",
      message: "Регистрация успешна",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(400);
    throw new Error("Неверные данные пользователя");
  }
});

// Логин
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Добавим отладочную информацию
  console.log("Попытка входа:", { email });

  // Валидация email
  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Неверный формат email");
  }

  const user = await User.findOne({ email });

  // Добавим отладочную информацию
  console.log("Найден пользователь:", user ? "да" : "нет");

  if (user) {
    const isMatch = await user.matchPassword(password);
    console.log("Пароль совпадает:", isMatch ? "да" : "нет");

    if (isMatch) {
      createToken(res, user._id);

      res.json({
        status: "success",
        message: "Успешный вход",
        user: {
          _id: user._id,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      throw new Error("Неверный email или пароль");
    }
  } else {
    res.status(401);
    throw new Error("Неверный email или пароль");
  }
});

// Выход
export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    status: "success",
    message: "Выход выполнен успешно",
  });
});

// Получение профиля текущего пользователя
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      status: "success",
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } else {
    res.status(404);
    throw new Error("Пользователь не найден");
  }
});

// Обновление пароля
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(currentPassword))) {
    // Просто устанавливаем новый пароль
    user.password = newPassword;
    // При сохранении пароль будет автоматически хешироваться через pre-save middleware
    await user.save();

    res.json({
      status: "success",
      message: "Пароль успешно обновлен",
    });
  } else {
    res.status(401);
    throw new Error("Неверный текущий пароль");
  }
});
