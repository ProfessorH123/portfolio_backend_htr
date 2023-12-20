const ProgrammingLanguage = require("../models/programming");

// GET ALL PROGRAMMING LANGUAGES
const getAllLanguages = async (req, res) => {
  try {
    const languages = await ProgrammingLanguage.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching programming languages" });
  }
};

// GET PROGRAMMING LANGUAGE BY ID
const getLanguageById = async (req, res) => {
  try {
    const language = await ProgrammingLanguage.findById(req.params.id);
    if (!language) {
      return res.status(404).json({ error: "Programming language not found" });
    }
    res.json(language);
  } catch (error) {
    res.status(500).json({ error: "Error fetching programming language" });
  }
};

// CREATE A NEW PROGRAMMING LANGUAGE
const createLanguage = async (req, res) => {
  try {
    const { name, frameworks } = req.body;
    const newLanguage = new ProgrammingLanguage({ name, frameworks });
    const savedLanguage = await newLanguage.save();
    res.json(savedLanguage);
  } catch (error) {
    res.status(500).json({ error: "Error creating programming language" });
  }
};

// UPDATE PROGRAMMING LANGUAGE BY ID
const updateLanguageById = async (req, res) => {
  try {
    const { name, frameworks } = req.body;
    const updatedLanguage = await ProgrammingLanguage.findByIdAndUpdate(
      req.params.id,
      { name, frameworks },
      { new: true }
    );
    if (!updatedLanguage) {
      return res.status(404).json({ error: "Programming language not found" });
    }
    res.json(updatedLanguage);
  } catch (error) {
    res.status(500).json({ error: "Error updating programming language" });
  }
};

// DELETE PROGRAMMING LANGUAGE BY ID
const deleteLanguageById = async (req, res) => {
  try {
    const deletedLanguage = await ProgrammingLanguage.findByIdAndDelete(
      req.params.id
    );
    if (!deletedLanguage) {
      return res.status(404).json({ error: "Programming language not found" });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: "Error deleting programming language" });
  }
};

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguageById,
  deleteLanguageById,
};
