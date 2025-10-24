import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();
await connectDB();

const app = express();

// ✅ CORS setup for both local + deployed frontend
app.use(
  cors({
    origin: [
      "https://birthdayfront.vercel.app",
      "http://localhost:5173",
    ],
  })
);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("🎂 BirthdayMailer Backend Running...");
});

app.use("/api", projectRoutes);

// Vercel requires this for serverless deployment
export default app;
