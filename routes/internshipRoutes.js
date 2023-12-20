const express = require("express");
const router = express.Router();
const InternshipController = require("../controllers/internshipController");

router.get("/my/internships", InternshipController.getAllInternships);
router.get("/my/internships/:id", InternshipController.getInternshipById);
router.post("/my/internships", InternshipController.createInternship);
router.put("/my/internships/:id", InternshipController.updateInternshipById);
router.delete("/my/internships/:id", InternshipController.deleteInternshipById);

module.exports = router;
