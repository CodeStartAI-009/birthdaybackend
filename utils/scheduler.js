import Project from "../models/projectModel.js";

export function startScheduler() {
  console.log("⏰ Scheduler started...");

  setInterval(async () => {
    const now = new Date();
    const projects = await Project.find({
      scheduledAt: { $lte: now },
      status: "pending",
    });

    for (let project of projects) {
      project.status = "available";
      await project.save();
      console.log(`🎉 Project ${project.token} is now available`);
    }
  }, 60 * 1000); // check every 1 minute
}
