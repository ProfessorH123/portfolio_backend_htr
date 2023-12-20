const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsLetterController");

router.get("/my/subscribers", newsletterController.getAllSubscribers);

router.get("/my/subscribers/:id", newsletterController.getSubscriberById);

router.post("/my/subscribe", newsletterController.subscribeEmail);

router.delete("/my/unsubscribe/:id", newsletterController.unsubscribeEmailById);

module.exports = router;
