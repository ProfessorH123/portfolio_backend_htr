const Information = require("../models/information");

// Create a new information entry
const createInformation = async (req, res) => {
  try {
    const newInformation = await Information.create(req.body);
    res.status(201).json(newInformation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all information entries
const getAllInformation = async (req, res) => {
  try {
    const allInformation = await Information.find();
    res.status(200).json(allInformation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get information by ID
const getInformationById = async (req, res) => {
  try {
    const information = await Information.findById(req.params.id);
    if (!information) {
      return res.status(404).json({ error: "Information not found" });
    }
    res.status(200).json(information);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update information by ID
const updateInformationById = async (req, res) => {
  try {
    const updatedInformation = await Information.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInformation) {
      return res.status(404).json({ error: "Information not found" });
    }
    res.status(200).json(updatedInformation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete information by ID
const deleteInformationById = async (req, res) => {
  try {
    const deletedInformation = await Information.findByIdAndDelete(
      req.params.id
    );
    if (!deletedInformation) {
      return res.status(404).json({ error: "Information not found" });
    }
    res.status(200).json({ message: "Information deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createInformation,
  getAllInformation,
  getInformationById,
  updateInformationById,
  deleteInformationById,
};
