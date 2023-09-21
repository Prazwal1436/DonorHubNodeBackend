const UserLocation = require("../model/UserLocation");
const {
  createLocationSchema,
  updateLocationSchema,
} = require("../validation/userLocation");

const createLocation = async (req, res) => {
  try {
    let { latitude, longitude } = await createLocationSchema.validateAsync(
      req.body
    );
    const user_id = req.decoded_token._id;
    await UserLocation.create({
      location: { type: "Point", coordinates: [longitude, latitude] },
      user_id,
    });
    res.status(201).json({ message: "Added successfully" });
  } catch (err) {
    return res.send({ err });
  }
};

const updateLocation = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;

    let { latitude, longitude } = await updateLocationSchema.validateAsync(
      req.body
    );
    await UserLocation.findOneAndUpdate(user_id, {
      location: { type: "Point", coordinates: [longitude, latitude] },
    });
    res.status(201).json({ message: "Updated successfully" });
  } catch (err) {
    return res.send({ err });
  }
};

const getUserLocationByID = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;
    let UserLocation = await UserLocation.findOne({ user_id });
    res.status(201).json(UserLocation);
  } catch (err) {
    return res.send({ err });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const user_id = req.decoded_token._id;

    const {_id, donation_status } = req.body;
    await UserLocation.findByIdAndUpdate(_id, {
      donation_status: donation_status,
      user_id,
    });
    res.status(201).json({ message: "Updated successfully" });
  } catch (err) {
    return res.send({ err });
  }
};

module.exports = {
  createLocation,
  getUserLocationByID,
  updateLocation,
  updateDonationStatus,
};
