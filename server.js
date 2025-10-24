import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import { startScheduler } from "./utils/scheduler.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Explicit CORS configuration
const allowedOrigins = [
  "https://birthdayfront.vercel.app", // frontend on Vercel
  "http://localhost:5173" // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("🎂 BirthdayMailer Backend Running...");
});

app.use("/api", projectRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startScheduler();
});
