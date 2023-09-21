const NeedBlood = require("../model/NeedBlood");
const UserLocation = require("../model/UserLocation");
const {
  createNeedSchema,
  updateNeedSchema,
} = require("../validation/needblood");
const moment = require("moment");

const getDonerList = async ({
 location,
  radius,
  bloodGroup,
  requiredDate,
}) => {

  const dob = moment(new Date.now).subtract(18, "years")
  return await UserLocation.aggregate([
    {
      $geoNear: {
        near: location,
        distanceField: "location",
        spherical: true,
        maxDistance: radius,
      },
    },
    {
      $lookup: {
        from: "UserData",
        localField: "_id",
        foreignField: "user_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "LastDonation",
        localField: "user_id",
        foreignField: "user_id",
        as: "donation",
      },
    },
    {
      $match: {
        donation_status: true,
      },
    },
    {
      $unwind: "$user",
    },
    {
      $unwind: "$donation",
    },
    {
      $match: {
        "user.dateOfBirth":{ $lt:dob},
        "user.bloodGroup": bloodGroup,
        "donation.donationDate": { $lt: requiredDate }

      },
    },
  ]).exec();
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
   
    res.status(200).json({ message: "NeedBlood Created Succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500)
    return res.send({ err });
  }
};

const updateNeedBlood = async (req, res) => {
  try {
    let {
      _id,
      bloodGroup,
      reason,
      date,
      urgent,
      latitude,
      longitude,
      status,
      user_id,
    } = await updateNeedSchema.validateAsync(req.body);
    if (user_id == req.decoded_token._id) {
      const needBlood = await NeedBlood.findByIdAndUpdate(
        _id,
        {
          bloodGroup,
          reason,
          date,
          urgent,
          location: { type: "Point", coordinates: [longitude, latitude] },
          status,
          user_id,
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
    let needBlood = await NeedBlood.findById({ _id });
    let radius = 500;
    let donorList = [];
    let location = needBlood.location;
    let bloodGroup = needBlood.bloodGroup;
    let date = needBlood.date;
    if (needBlood.status == "ongoing" || needBlood.status == "notfound") {
      let requiredDate = moment(date).subtract(90, "days");
      let index = radius;
      for (index; index < 10000; index += 500) {
        radius = radius+500;
        donorList = await getDonerList({
          location,
          radius,
          bloodGroup,
          requiredDate,
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
    } else if (needBlood.status == "notneeded") {
      res.status(201).json({ message: "Thankyou If You Need Please Let us Know" });
    } else {
      res.status(200).json(donorList);
    }
    res.status(201).json({ message: "Not Found Upto 10KM of radious" });
  } catch (err) {
    return res.send({ err });
  }
};

const getNeedBloodByUserID = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;
    let lastNeedBlood = await NeedBlood.find({ user_id });
    
    res.status(200).json(lastNeedBlood);
  } catch (err) {
    return res.send({ err });
  }
};


module.exports = {
  createNeedBlood,
  getNeedBloodByUserID,
  getNeedBloodByID,
  updateNeedBlood,
};
