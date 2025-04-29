const AppliedJob = require("../models/appliedJobsModel");
const JobModel = require("../models/JobModel");
const nodemailer = require("nodemailer");

const applyForJob = async (req, res) => {
  const {
    userId,
    jobId,
    FirstAnswer,
    SecondAnswer,
    thirdAnswer,
    FourthAnswer,
  } = req.body;

  try {
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingAppliedJob = await AppliedJob.findOne({ userId, jobId });

    if (existingAppliedJob) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job!" });
    }

    let appliedJobData = {
      userId,
      jobId,
      appliedJobStatus: "pending",
    };

    if (job.additionalJobForm) {
      if (!FirstAnswer || !SecondAnswer || !thirdAnswer || !FourthAnswer) {
        return res
          .status(400)
          .json({ message: "All form answers are required" });
      }
      appliedJobData = {
        ...appliedJobData,
        FirstAnswer,
        SecondAnswer,
        thirdAnswer,
        FourthAnswer,
        additionalFormSubmitted: true,
      };
    }

    const appliedJob = new AppliedJob(appliedJobData);
    await appliedJob.save();

    job.JobSeekersCounts += 1;
    await job.save();

    return res
      .status(201)
      .json({
        message: "Congratulations, you applied successfully",
        data: appliedJob,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const getAllAppliedJobsByJobSeeker = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query;

    const limitInt = parseInt(limit, 10);
    const pageInt = parseInt(page, 10);
    const AllAppliedJobsByJobSeeker = await AppliedJob.find({ userId })
      .limit(limitInt)
      .skip((pageInt - 1) * limitInt)
      .populate("jobId");

    const totalItems = await AppliedJob.countDocuments({ userId });

    const response = {
      message: "All applied jobs by this user",
      totalItems,
      totalPages: Math.ceil(totalItems / limitInt),
      currentPage: pageInt,
      data: AllAppliedJobsByJobSeeker,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllAppliedJobs = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { page = 1, limit = 6 } = req.query;

    const limitInt = parseInt(limit, 10);
    const pageInt = parseInt(page, 10);

    const AllAppliedJobs = await AppliedJob.find({ jobId })
      .limit(limitInt)
      .skip((pageInt - 1) * limitInt)
      .populate("userId");

    const totalItems = await AppliedJob.countDocuments({ jobId });

    const response = {
      totalItems,
      totalPages: Math.ceil(totalItems / limitInt),
      currentPage: pageInt,
      data: AllAppliedJobs,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAppliedJob = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const deletedAppliedJob = await AppliedJob.findByIdAndDelete(applicationId);

    if (!deletedAppliedJob) {
      return res.status(404).json({ message: "Applied Job not found" });
    }

    res.json({
      message: "This Applied Job deleted successfully",
      data: deletedAppliedJob,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCountByUser = async (req, res) => {
  try {
    const { jobId } = req.params;
    const appliedJobCount = await AppliedJob.countDocuments({ jobId });
    res.status(200).json({ count: appliedJobCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countAppliedJobsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const count = await AppliedJob.countAppliedJobsByUser(userId);
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getApplicantId = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.params.userId;
    const findApplicant = await AppliedJob.findOne({ jobId, userId });
    if (!findApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    res.status(200).json(findApplicant);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
};

const updateApplicationStatusAndNotify = async (req, res) => {
  try {
    const { applicationId, decision } = req.body;

    const updatedApplication = await AppliedJob.updateApplicationStatus(
      applicationId,
      decision
    );

    const userEmail = updatedApplication.userId.email;
    const userName =
      updatedApplication.userId.firstName || updatedApplication.userId.lastName;

    let subject, htmlContent;
    if (decision === "accepted") {
      subject = "Congratulations! Your application has been accepted";
      htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px; }
              .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
              h1 { color: #4CAF50; font-size: 24px; }
              p { font-size: 16px; line-height: 1.6; }
              .button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Congratulations, ${userName}!</h1>
              <p>You have been accepted for the job you applied for. We wish you the best of luck in your new role! 🎉</p>
              <p>Feel free to reach out to us if you have any questions or need assistance.</p>
              <a href="#" class="button">Go to your Dashboard</a>
            </div>
          </body>
        </html>
      `;
    } else {
      subject =
        "We regret to inform you that your application has not been accepted";
      htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 20px; }
              .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
              h1 { color:rgb(2, 172, 22); font-size: 24px; }
              p { font-size: 16px; line-height: 1.6; }
              .button { background-color:rgb(2, 172, 22); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Dear ${userName},</h1>
              <p>Unfortunately, your application for the job has been declined. Don't be discouraged, keep trying, and good luck next time! 🌟</p>
              <p>We encourage you to apply for future opportunities with us.</p>
              <a href="https://www.linkedin.com/in/madonna-adel-" class="button">Visit our Careers Page</a>
            </div>
          </body>
        </html>
      `;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject,
      html: htmlContent,
    });

    res
      .status(200)
      .json({
        message: "Status updated and email sent successfully",
        updatedApplication,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  applyForJob,
  getAllAppliedJobsByJobSeeker,
  getAllAppliedJobs,
  deleteAppliedJob,
  getCountByUser,
  countAppliedJobsByUser,
  getApplicantId,
  updateApplicationStatusAndNotify,
};
