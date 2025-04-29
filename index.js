const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const { swaggerUi, swaggerSpec } = require("./swagger");
const port = process.env.PORT || 3000;

const JobRoute = require("./routes/JobRoute");
const CompanyRoute = require("./routes/CompanyRoutes");
const usersRoute = require("./routes/userRoute");
const additionalQuestionsRoute = require("./routes/additionalQuestionsRoutes");
const savedJobRoutes = require("./routes/savedJobsRoute");
const appliedJobsRoute = require("./routes/appliedJobsRoute");
const upload = require("./routes/upload");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'User-Id'",
    methods: "GET, POST, PATCH, DELETE, OPTIONS, PUT",
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/users", usersRoute);
app.use("/jobs", JobRoute);
app.use("/additionalQuestions", additionalQuestionsRoute);
app.use("/companies", CompanyRoute);
app.use("/savedJobs", savedJobRoutes);
app.use("/appliedJobs", appliedJobsRoute);
app.use("/upload", upload);
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log("Server started at Port", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
module.exports = app;
