import express from "express";
import Project from "../models/projectModel.js";

const router = express.Router();

// Create project
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Playback route
router.get("/play/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const project = await Project.findOne({ token });

    if (!project) return res.status(404).json({ error: "Project not found" });

    const now = new Date();
    if (now < project.scheduledAt || project.status !== "available") {
      return res.status(403).json({ error: "This project is not available yet" });
    }

    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
