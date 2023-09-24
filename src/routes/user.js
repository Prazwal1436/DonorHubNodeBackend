const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getUser,
  changePassword,
  updateUser,
  changeStatus,
  resetPassword,
} = require("../controller/userController");
const { sendOTP,verifyOtp } = require("../controller/otpController");
const { validateAccessToken } = require("../middlewere/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/password", validateAccessToken, changePassword);
router.post("/update-user", validateAccessToken, updateUser);
router.get("/get-user", validateAccessToken, getUser);
router.post("/status", validateAccessToken, changeStatus);
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);
router.post("/verify-Otp", verifyOtp);

module.exports = router;


