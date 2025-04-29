const mongoose = require("mongoose");
const appliedJobStatusEnum = ["accepted", "rejected", "pending"];

const AppliedJobsSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appliedJobStatus: {
    type: String,
    required: true,
    enum: appliedJobStatusEnum,
    default: "pending",
  },additionalFormSubmitted:{
    type:Boolean,
    default:false
  },
  FirstAnswer:{type:String },
  SecondAnswer:{type:String  },
  thirdAnswer:{type:String },
  FourthAnswer:{type:String },
  timeStamp: {
    type: Date,
    default: Date.now,
  }
});
AppliedJobsSchema.statics.countAppliedJobsByUser = async function(userId) {
  try {
      const count = await this.countDocuments({ userId });
      return count;
  } catch (err) {
      throw err;
  }
};

AppliedJobsSchema.statics.updateApplicationStatus = async function (applicationId, status) {
  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status. It must be either 'accepted' or 'rejected'.");
  }

  const application = await this.findByIdAndUpdate(
    applicationId,
    { appliedJobStatus: status },
    { new: true }
  ).populate('userId');

  if (!application) {
    throw new Error("Application not found");
  }

  return application;
};




const AppliedJob = mongoose.model("AppliedJob", AppliedJobsSchema);
module.exports = AppliedJob;
