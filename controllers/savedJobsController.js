const SavedJob = require("../models/savedJobsModel");
const mongoose = require("mongoose");

exports.getSavedJobs = async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  try {
    const savedJobs = await SavedJob.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("jobId");

    if (!savedJobs || savedJobs.length === 0) {
      return res.status(404).json({ message: "No saved jobs found" });
    }

    res.json(savedJobs);
  } catch (err) {
    console.error("Error getting saved jobs:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteSavedJob = async (req, res) => {
  const savedJobId = req.params.savedJobId;

  try {
    await SavedJob.findByIdAndDelete(savedJobId);
    res.json({ message: "Saved job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.saveJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    const existingSavedJob = await SavedJob.findOne({ userId, jobId });
    if (existingSavedJob) {
      return res
        .status(400)
        .json({ message: "This Job is already saved by this user!!!!" });
    }

    const savedJob = new SavedJob({ userId, jobId });
    await savedJob.save();

    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.countSavedJobsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const count = await SavedJob.countSavedJobsByUser(userId);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
