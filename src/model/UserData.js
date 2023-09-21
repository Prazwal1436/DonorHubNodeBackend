const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, select:false },
    phoneNo: { type: String, required: false },
    bloodGroup: { type: String, required: false, enum: ["a+", "a-","b+", "b-","ab+", "ab-","o+", "o-",]  },
    fullName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String,required: false , enum: ["male", "female", "other"] },
    public: { type: Boolean,required: false },
  },
  {
    timestamps: true,
  }
);

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
