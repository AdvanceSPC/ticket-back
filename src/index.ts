import dotenv from "dotenv";
import express from "express";
import { authenticate } from "./middlewares/auth.middlewares";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/tickets", authenticate, ticketRoutes);

const PORT = process.env.PORT || 3000;
console.log(process.env.JWT_SECRET)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
