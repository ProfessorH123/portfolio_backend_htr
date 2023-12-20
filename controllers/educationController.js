const Education = require("../models/education");

// GET ALL EDUCATION
const getAllEducation = async (req, res) => {
  try {
    const educationList = await Education.find();
    res.json(educationList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching education" });
  }
};

// GET EDUCATION BY ID
const getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ error: "Education not found" });
    }
    res.json(education);
  } catch (error) {
    res.status(500).json({ error: "Error fetching education" });
  }
};

// CREATE A NEW EDUCATION ENTRY
const createEducation = async (req, res) => {
  try {
    const { period, degree, school, location, mention } = req.body;
    const newEducation = new Education({
      period,
      degree,
      school,
      location,
      mention,
    });
    const savedEducation = await newEducation.save();
    res.json(savedEducation);
  } catch (error) {
    res.status(500).json({ error: "Error creating education" });
  }
};

// UPDATE EDUCATION BY ID
const updateEducationById = async (req, res) => {
  try {
    const { period, degree, school, location, mention } = req.body;
    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      { period, degree, school, location, mention },
      { new: true }
    );
    if (!updatedEducation) {
      return res.status(404).json({ error: "Education not found" });
    }
    res.json(updatedEducation);
  } catch (error) {
    res.status(500).json({ error: "Error updating education" });
  }
};

// DELETE EDUCATION BY ID
const deleteEducationById = async (req, res) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation) {
      return res.status(404).json({ error: "Education not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting education" });
  }
};

module.exports = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducationById,
  deleteEducationById,
};
