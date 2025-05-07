const mongoose = require("mongoose");

let isConnected;

const connectToDB = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0].readyState;
    console.log("=> connected to database");
  } catch (error) {
    console.error("=> error connecting to database:", error);
    throw error;
  }
};

module.exports = connectToDB;
