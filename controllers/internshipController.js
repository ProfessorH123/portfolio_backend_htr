const Internship = require("../models/internship");

// GET ALL INTERNSHIPS
const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: "Error fetching internships" });
  }
};

// GET INTERNSHIP BY ID
const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: "Error fetching internship" });
  }
};

// CREATE A NEW INTERNSHIP
const createInternship = async (req, res) => {
  try {
    const { title, description, duration, tags } = req.body;
    const newInternship = new Internship({
      title,
      description,
      duration,
      tags,
    });
    const savedInternship = await newInternship.save();
    res.json(savedInternship);
  } catch (error) {
    res.status(500).json({ error: "Error creating internship" });
  }
};

// UPDATE INTERNSHIP BY ID
const updateInternshipById = async (req, res) => {
  try {
    const { title, description, duration, tags } = req.body;
    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, tags },
      { new: true }
    );
    if (!updatedInternship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.json(updatedInternship);
  } catch (error) {
    res.status(500).json({ error: "Error updating internship" });
  }
};

// DELETE INTERNSHIP BY ID
const deleteInternshipById = async (req, res) => {
  try {
    const deletedInternship = await Internship.findByIdAndDelete(req.params.id);
    if (!deletedInternship) {
      return res.status(404).json({ error: "Internship not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting internship" });
  }
};

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternshipById,
  deleteInternshipById,
};
