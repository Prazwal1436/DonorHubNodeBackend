const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const UserData = require("../model/UserData");
const saltRounds = 10;
const { signupSchema, loginSchema, passwordSchema,updateSchema } = require("../validation/user");
const signup = async (req, res) => {
 

  try {
    let {
      email,
      password,
      phoneNo,
      bloodGroup,
      fullName,
      dateOfBirth,
      gender,
      public,
    } = await signupSchema.validateAsync(req.body);
    let hashed_password = await bcrypt.hash(password, saltRounds);

    let user = await UserData.findOne({ email });
    if (!user) {
      user= await UserData.create({
        email,
        password: hashed_password,
        phoneNo,
        bloodGroup,
        fullName,
        dateOfBirth,
        gender,
        public
      });
      let user_obj=user.toObject();
      delete user_obj.password;
  
      var access_token = jwt.sign(user_obj, process.env.JWT_SECRET, {});
      return res.status(201).send({
        access_token,
      });
    } else {
      res.status(401).json({ message: "Email Already Exist" });
    }
  } catch (err) {
    return res.send(err);
  }
};

const login = async (req, res) => {
 
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);
    // Load hash from your password DB.
    let user = await UserData.findOne({ email }).select(["name", "password"]);

    let status = await bcrypt.compare(password, user?.password || "");

    if (!user || !status) {
      return res.status(401).send({
        message: "Invalid Credentials",
      });
    }

    let user_data = await UserData.findById(user._id)

    let user_obj=user_data.toObject();

    var access_token = jwt.sign(user_obj, process.env.JWT_SECRET, {});

    return res.status(200).send({
      access_token,
    });
  } catch (err) {
    return res.send(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await UserData.findById(req.decoded_token._id);
    res.send(user);
  } catch (err) {
    res.status_code = 401;
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newpassword } = await passwordSchema.validateAsync(
      req.body
    );
    const _id = req.decoded_token._id;
    const user = await UserData.findById(_id).select(["password"]);

    let status = await bcrypt.compare(password, user?.password || "");
    if (!status) {
      return res.status(401).send({
        message: "Old Password Doesnt Match",
      });
    } else {
      let hashed_password = await bcrypt.hash(newpassword, saltRounds);
      await UserData.findByIdAndUpdate(_id, { password: hashed_password });
      return res.status(201).send({
        message: "Password Changed Succesfully",
      });
    }
  } catch (err) {
    return res.send({ err });
  }
};
const updateUser = async (req, res, next) => {
  try {
    const {
      password,
      phoneNo,
      bloodGroup,
      fullName,
      dateOfBirth,
      gender,
      public
    } = await updateSchema.validateAsync(req.body);
    const _id = req.decoded_token._id;
    let user = await UserData.findById(_id).select(["password"]);

    let passstat = await bcrypt.compare(password, user?.password || "");
    if (!passstat) {
      return res.status(401).send({
        message: "Password Doesnt Match",
      });
    } else {
       user = await UserData.findByIdAndUpdate(_id, {
        phoneNo,
        bloodGroup,
        fullName,
        dateOfBirth,
        gender,
        public
      });
      let user_obj=user.toObject();
      delete user_obj.password;
  
      var access_token = jwt.sign(user_obj, process.env.JWT_SECRET, {});
      return res.status(201).send({
        access_token,
      });
    }
  } catch (err) {
    return res.send({ err });
  }
};

module.exports = {
  signup,
  login,
  getUser,
  changePassword,
  updateUser
};