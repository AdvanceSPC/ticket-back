import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authenticate } from "./middlewares/auth.middlewares";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";

dotenv.config();
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:4173"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tickets", authenticate, ticketRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
