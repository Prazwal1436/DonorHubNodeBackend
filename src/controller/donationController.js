const { createDonationSchema, updateDonationSchema } = require("../validation/donation");
const LastDonation = require("../model/LastDonation");

const createDonation = async (req, res) => {
  try {
    let { donationDate } = await createDonationSchema.validateAsync(req.body)
    const user_id = req.decoded_token._id;
    await LastDonation.create({
      donationDate,
      user_id,
    });
    res.status(201).json({ message: "Added successfully" });
  } catch (err) {
    return res.send({ err });
  }
};

const updateDonation = async (req, res) => {
  try {
    let { _id, donationDate } = await updateDonationSchema.validateAsync(req.body)
    const user_id = req.decoded_token._id;
    await LastDonation.findByIdAndUpdate(_id, { donationDate, user_id });
    res.status(201).json({ message: "Updated successfully" });
  } catch (err) {
    return res.send({ err });
  }
};

const getLastDonationByID = async (req,res)=>{
  try {
    const user_id = req.decoded_token._id;
    let donations = await LastDonation.find({ user_id }).sort({ createdAt: -1 });
    let count=donations?.length;
    res.status(201).json({count,lastDonationDate:donations?.[count -1]?.createdAt});
  } catch (err) {
    return res.send({ err });
  }
}

const getDonationListByID = async (req,res)=>{
  try {
    const user_id = req.decoded_token._id;
    let lastDonation = await LastDonation.find({ user_id });
    res.status(201).json(lastDonation);
  } catch (err) {
    return res.send({ err });
  }
}


module.exports={createDonation,getDonationListByID,getLastDonationByID,updateDonation}
