const { isEmpty } = require("lodash");
const NeedBlood = require("../model/NeedBlood");
const UserLocation = require("../model/UserLocation");
const UserData = require("../model/UserData");

const {
  createNeedSchema,
  updateNeedSchema,
} = require("../validation/needblood");
const moment = require("moment");

const getDonerRequiredList = async ({
  latitude,
  longitude,
  radius,
  bloodGroup,
  email
}) => {
  const list = await NeedBlood.aggregate([

    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "location",
        spherical: true,
        maxDistance: radius,
      },
    },
    {
      $lookup: {
        from: "userdatas",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $match: {
        status: { $ne: "notneeded" },
        bloodGroup:bloodGroup,
        "user.email": { $ne: email },
      }
    },
    {
      $addFields: {
        email: "$user.email",
        phoneNo: "$user.phoneNo",
        fullName: "$user.fullName",
        gender: "$user.gender",
        user_id: "$user._id",
        dateOfBirth: "$user.dateOfBirth",
      },
    },
    {
      $project: {
        user: 0,
      },
    },
  ]);
  return list;
};

const getDonerList = async ({
  latitude,
  longitude,
  radius,
  bloodGroup,
  requiredDate,
  email
}) => {
  const dob = moment(new Date()).subtract(18, "years");
  const list = await UserLocation.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [longitude, latitude] },
        distanceField: "location",
        spherical: true,
        maxDistance: radius,
      },
    },
    {
      $lookup: {
        from: "userdatas",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "userlocations",
        localField: "user_id",
        foreignField: "user_id",
        as: "donation",
      },
    },
    {
      $unwind: "$donation",
    },
    {
      $match: {
        "user.dateOfBirth": { $lt: new Date(dob) },
        "user.bloodGroup": bloodGroup,
        "user.public": true,
        "user.email": { $ne: email },
        $or: [
          { "donation.donationDate": { $lt: new Date(requiredDate) } },
          { "donation.donationDate": { $exists: false } },
        ],
      },
    },
    {
      $addFields: {
        email: "$user.email",
        location: "$donation.location",
        phoneNo: "$user.phoneNo",
        fullName: "$user.fullName",
        bloodGroup: "$user.bloodGroup",
        gender: "$user.gender",
        user_id: "$user._id",
        dateOfBirth: "$user.dateOfBirth",
      },
    },
    {
      $project: {
        user: 0,
        donation: 0,
      },
    },
  ]);
  return list;
};
const createNeedBlood = async (req, res) => {
  try {
    let { bloodGroup, reason, date, urgent, latitude, longitude, status } =
      await createNeedSchema.validateAsync(req.body);
    const user_id = req.decoded_token._id;
    const needBlood = await NeedBlood.create({
      bloodGroup,
      reason,
      date,
      urgent,
      location: { type: "Point", coordinates: [longitude, latitude] },
      status,
      user_id,
    });

    res
      .status(200)
      .json({ needBlood, message: "NeedBlood Created Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.send({ err });
  }
};

const updateNeedBlood = async (req, res) => {
  try {
    let {
      _id,
      status,
      user_id,
    } = await updateNeedSchema.validateAsync(req.body);
    if (user_id == req.decoded_token._id) {
      const needBlood = await NeedBlood.findByIdAndUpdate(
        _id,
        {
          status,
        },
        {
          new: true,
        }
      );

      res.status(201).json({ message: "Need Blood Updated Sucessfully" });
    } else {
      res.status(401).json({ message: "You are Not allowed to update others" });
    }
  } catch (err) {
    return res.send({ err });
  }
};

const getNeedBloodByID = async (req, res) => {
  try {
    const _id = req.params.id;

    const needBlood = await NeedBlood.findById(_id);
    let radius = 500;
    let donorList = [];
    let latitude = needBlood?.location?.coordinates?.[1];
    let longitude = needBlood?.location?.coordinates?.[0];
    let bloodGroup = needBlood?.bloodGroup;
    let date = needBlood?.date;
    let user_id = needBlood?.user_id;
    let user = await  UserData.findById({_id:user_id});
    
    if (
      needBlood?.status == "ongoing" ||
      needBlood?.status == "notfound" ||
      !isEmpty(needBlood)
    ) {
      let requiredDate = moment(date).subtract(90, "days");
      let index = radius;
      for (index; index < 10000; index += 500) {
        radius = radius + 500;
        donorList = await getDonerList({
          latitude,
          longitude,
          radius,
          bloodGroup,
          requiredDate,
          email:user?.email
        });
        if (donorList.length) {
          break;
        }
      }
      if (!donorList) {
        await NeedBlood.findByIdAndUpdate(_id, {
          status: "notfound",
          radius,
        });
      } else {
        await NeedBlood.findByIdAndUpdate(_id, {
          status: "found",
          radius,
        });
      }
    }
    res.status(200).json({
      message: donorList?.length
        ? `Doner found in ${radius}m radius`
        : `Doner not found in ${radius}m radius`,
      data: { radius, donorList },
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({ err });
  }
};

const getNeedBloodByUserID = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;
    let lastNeedBlood = await NeedBlood.find({ user_id }).sort({
      createdAt: -1,
    });

    res.status(200).json(lastNeedBlood);
  } catch (err) {
    return res.send({ err });
  }
};

const getRequiredBlood = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;

    const userLocationData = await UserLocation.findOne( {user_id}).populate("user_id");
    let radius = 10000;
    let donorRequiredList = [];
    let latitude = userLocationData?.location?.coordinates?.[1];
    let longitude = userLocationData?.location?.coordinates?.[0];
    let bloodGroup = userLocationData?.user_id?.bloodGroup;
    let email= userLocationData?.user_id?.email;

    donorRequiredList = await getDonerRequiredList({
      latitude,
      longitude,
      radius,
      bloodGroup,
      email
    });

    res.status(200).json({
      message: donorRequiredList?.length
        ? `Doner needed in ${radius}m radius`
        : `Doner not needed in ${radius}m radius`,
      data: { radius, donorRequiredList },
      code: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({ err });
  }
};

module.exports = {
  createNeedBlood,
  getNeedBloodByUserID,
  getNeedBloodByID,
  updateNeedBlood,
  getRequiredBlood,
};
