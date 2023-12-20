const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

// Routes for education data
router.get("/my/education", educationController.getAllEducation);
router.get("/my/education/:id", educationController.getEducationById);
router.post("/my/education", educationController.createEducation);
router.put("/my/education/:id", educationController.updateEducationById);
router.delete("/my/education/:id", educationController.deleteEducationById);

module.exports = router;
