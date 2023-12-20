const mongoose = require("mongoose");

const programmingLanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  frameworks: [String],
});

const ProgrammingLanguage = mongoose.model(
  "ProgrammingLanguage",
  programmingLanguageSchema
);

module.exports = ProgrammingLanguage;
