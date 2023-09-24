const otpGenerator = require("otp-generator");
const OTP = require("../model/OTPModel");
const User = require("../model/UserData");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser.email) {
      return res.status(400).json({
        success: false,
        message: "User does not exists",
      });
    }

    const otpRes = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (otpRes.length === 0 || otp !== otpRes[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }
    let _id = existingUser?._id;

    user = await User.findByIdAndUpdate(_id, {
      verified: true,
    });
    return res.status(201).send({
      message: "User verified Changed Succesfully",
    });
  } catch (err) {
    console.log({ err });
    return res.send({ err });
  }
};
module.exports = {sendOTP,verifyOtp}