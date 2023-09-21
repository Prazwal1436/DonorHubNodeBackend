const Joi = require("joi");

const createNeedSchema = Joi.object({
  user_id: Joi.string(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  reason: Joi.string().allow(null).allow("").optional(),
  date: Joi.date().allow(null).allow("").optional(),
  urgent: Joi.bool(),
  status: Joi.string()
    .pattern(new RegExp("^(ongoing|found|finding|notfound)$"))
    .allow(null)
    .allow("")
    .optional(),
  bloodGroup: Joi.string()
    .allow("")
    .optional(),
});

const updateNeedSchema = Joi.object({
    user_id: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    reason: Joi.string().allow(null).allow("").optional(),
    date: Joi.date().allow(null).allow("").optional(),
    urgent: Joi.bool(),
    status: Joi.string()
      .pattern(new RegExp("^(ongoing|found|notfound|notneeded)$"))
      .allow(null)
      .allow("")
      .optional(),
    bloodGroup: Joi.string()
      .allow("")
      .optional(),
  });


module.exports = { createNeedSchema,updateNeedSchema };
