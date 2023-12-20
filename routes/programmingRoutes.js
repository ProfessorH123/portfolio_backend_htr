const express = require("express");
const router = express.Router();
const ProgrammingController = require("../controllers/programmingController");

router.get("/programming/languages", ProgrammingController.getAllLanguages);
router.get("/programming/languages/:id", ProgrammingController.getLanguageById);
router.post("/programming/languages", ProgrammingController.createLanguage);
router.put(
  "/programming/languages/:id",
  ProgrammingController.updateLanguageById
);
router.delete(
  "/programming/languages/:id",
  ProgrammingController.deleteLanguageById
);

module.exports = router;
