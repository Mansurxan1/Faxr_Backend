import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import tourRoutes from './routes/tourRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// CORS настройка
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
  "http://localhost:3000",
  "https://www.faxr-travel.uz"
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "nice" });
});

export default app; 