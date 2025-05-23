const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌:", error);
    throw error;
  }
};

module.exports = connectDB;
