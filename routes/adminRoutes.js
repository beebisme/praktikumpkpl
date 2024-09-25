const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const adminController = require("../controller/adminController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/request-reset", adminController.requestResetPassword);
router.post("/reset", adminController.resetPassword);

module.exports = router;
