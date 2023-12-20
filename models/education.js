const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  mention: String,
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
