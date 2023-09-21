const Joi = require("joi");

const createLocationSchema = Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number()
});
const updateLocationSchema = Joi.object({
    _id:Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number()
});



module.exports={createLocationSchema,updateLocationSchema}