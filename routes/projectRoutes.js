import express from "express";
import moment from "moment-timezone";
import Project from "../models/projectModel.js";

const router = express.Router();

// 🧩 Create project
router.post("/projects", async (req, res) => {
  try {
    const project = await Project.create({
      title: req.body.title,
      theme: req.body.theme,
      images: req.body.images,
      audio: req.body.audio,
      video: req.body.video,
      recipientEmail: req.body.recipientEmail,
      recipientPhone: req.body.recipientPhone,
      scheduledAt: new Date(req.body.scheduledAt),
    });

    res.json({ token: project.token });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🎬 Playback route
router.get("/play/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const project = await Project.findOne({ token });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // ✅ Convert both to IST
    const nowIST = moment().tz("Asia/Kolkata");
    const scheduledIST = moment(project.scheduledAt).tz("Asia/Kolkata");

    console.log("🕒 Now (IST):", nowIST.format());
    console.log("📅 Scheduled (IST):", scheduledIST.format());
    console.log("📦 Status:", project.status);

    // If current time passed but still pending, mark available
    if (nowIST.isSameOrAfter(scheduledIST) && project.status === "pending") {
      project.status = "available";
      await project.save();
    }

    if (nowIST.isBefore(scheduledIST) || project.status !== "available") {
      const remainingMinutes = scheduledIST.diff(nowIST, "minutes");
      return res.status(403).json({
        error:
          remainingMinutes > 0
            ? `This project is not available yet. Will be available in ${remainingMinutes} minutes.`
            : "This project is not available yet.",
        scheduledAt: scheduledIST.format("YYYY-MM-DD HH:mm:ss"),
        now: nowIST.format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    // ✅ Available
    res.json({ project });
  } catch (err) {
    console.error("❌ Error in /play route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
