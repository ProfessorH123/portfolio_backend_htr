const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/projectController");

router.get("/my/projects", ProjectController.getAllProjects);
router.get("/my/projects/:id", ProjectController.getProjectById);
router.post("/my/projects", ProjectController.createProject);
router.put("/my/projects/:id", ProjectController.updateProjectById);
router.delete("/my/projects/:id", ProjectController.deleteProjectById);

module.exports = router;
