import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import { startScheduler } from "./utils/scheduler.js";

dotenv.config();
connectDB();

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: process.env.BASE_URL || "https://birthdayfront.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("🎂 BirthdayMailer Backend Running...");
});

app.use("/api", projectRoutes);

// Start scheduler (for tasks like sending emails on schedule)
startScheduler();

// Export the app for Vercel serverless deployment
export default app;
