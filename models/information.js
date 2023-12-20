const mongoose = require("mongoose");
const Project = require("./projects");

const informationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dhzlfojtv/image/upload/v1688486619/th-removebg-preview_uzovfh.png",
  },
  age: {
    type: Number,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  numberOfCompletedProjects: {
    type: Number,
    required: true,
  },
  emails: {
    type: [String],
    required: true,
  },
  phoneNumbers: {
    type: [String],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  aboutMe: {
    type: String,
  },
  resumeLink: {
    type: String,
  },
});

informationSchema.pre("save", async function (next) {
  try {
    const allProjectsCount = await Project.countDocuments();
    this.numberOfCompletedProjects = allProjectsCount;
    next();
  } catch (error) {
    next(error);
  }
});

const Information = mongoose.model("Information", informationSchema);

module.exports = Information;
