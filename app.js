const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
mongoose.set("strictQuery", false);

const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const internshipRoutes = require("./routes/internshipRoutes");
const programmingRoutes = require("./routes/programmingRoutes");
const projectRoutes = require("./routes/projectRoutes");
const informationRoutes = require("./routes/informationRoutes");
const educationRoutes = require("./routes/educationRoutes");
const newsRoutes = require("./routes/newsletterRoutes");

// CONNECT TO MONGO DB
mongoose
  .connect(process.env.DATABASECLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// ROUTES
app.use("/", userRoutes);
app.use("/", notificationRoutes);
app.use("/", internshipRoutes);
app.use("/", programmingRoutes);
app.use("/", projectRoutes);
app.use("/", informationRoutes);
app.use("/", educationRoutes);
app.use("/", newsRoutes);

// START  THE SERVER
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("YEAH IT WORKS");
});

module.exports = app;
