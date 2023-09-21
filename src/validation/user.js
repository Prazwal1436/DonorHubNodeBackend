const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(8).max(30),
  fullName: Joi.string().allow(null).allow('').optional(),
  phoneNo:Joi.string(),
  dateOfBirth: Joi.date().allow(null).allow('').optional(),
  gender: Joi.string().pattern(new RegExp("^(male|female|other)$")).allow(null).allow('').optional(),
  public: Joi.bool(),
  bloodGroup: Joi.string().allow(null).allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(8).max(30),
});

const passwordSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(8).max(30),
  newpassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(8).max(30),
});

const updateSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).min(8).max(30),
  fullName: Joi.string().allow(null).allow('').optional(),
  phoneNo: Joi.string(),
  dateOfBirth: Joi.date().allow(null).allow('').optional(),
  gender: Joi.string().pattern(new RegExp("^(male|female|other)$")).allow(null).allow('').optional(),
  public: Joi.bool(),
  bloodGroup: Joi.string().allow(null).allow('').optional(),
});
module.exports={signupSchema,loginSchema,passwordSchema, updateSchema}