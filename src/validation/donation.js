const Joi = require("joi");

const createDonationSchema = Joi.object({
    donationDate: Joi.date().allow(null).allow('').optional(),
});
const updateDonationSchema = Joi.object({
    _id:Joi.string(),
    donationDate: Joi.date().allow(null).allow('').optional(),
});



module.exports={createDonationSchema,updateDonationSchema}