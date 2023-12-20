const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/userInfo", UserController.getUserInfo);

router.post("/login", UserController.login);
router.post("/reset-password/:token", UserController.resetPassword);
router.post("/reset-email", UserController.validateEmailAndSendResetEmail);

router.delete(
  "/delete-expired-users",
  UserController.deleteUsersWithExpiredTokens
);

router.get("/reset-expired-tokens", UserController.resetExpiredTokens);
router.get("/visit", UserController.incrimentNumberOfVisitors);
router.get("/count", UserController.getNumberOfVisitors);
router.get("/user-per-month", UserController.getNumberOfUsersPerMonth);
router.get("/user-per-year", UserController.getNumberOfUsersPerYear);
router.get("/user-with-amount", UserController.getAllUsersWithAmount);
router.get("/user-per-country", UserController.getNumberOfUsersForEachCountry);

router.get("/all-users", UserController.getAllUsers);
router.delete("/delete-selected-users", UserController.deleteSelectedUsers);
router.delete("/users/:userId", UserController.deleteUserById);
router.put("/users/:userId", UserController.updateUserProfile);
router.post("/send-email", UserController.sendEmail);
router.put("/user-status", UserController.updateUserStatus);
router.get("/getUserById/:id", UserController.getUserById);
router.post("/translate", UserController.translateTo);
module.exports = router;
