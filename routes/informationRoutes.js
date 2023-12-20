const express = require("express");
const informationController = require("../controllers/informationController");

const router = express.Router();

router.post("/my/information", informationController.createInformation);
router.get("/my/information", informationController.getAllInformation);
router.get("/my/information/:id", informationController.getInformationById);
router.put("/my/information/:id", informationController.updateInformationById);
router.delete(
  "/my/information/:id",
  informationController.deleteInformationById
);

module.exports = router;
