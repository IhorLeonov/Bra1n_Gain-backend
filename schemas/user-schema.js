const Joi = require('joi');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// const phoneRegexp = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': `"Name" cannot be an empty field`,
    'any.required': `"Name" is a required field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': `"Email" is invalid`,
    'string.empty': `"Email" cannot be an empty field`,
    'any.required': `"Email" is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.pattern.base': `"Email" is invalid`,
    'string.empty': `"Email" cannot be an empty field`,
    'any.required': `"Email" is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': `"Password" cannot be an empty field`,
    'string.min': `"Password" should have a minimum length of {#limit}`,
    'any.required': `"Password" is a required field`,
  }),
});

const updateUserProfileSchema = data =>
  Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    // .pattern().messages({
    // emailRegexp
    // emailRegexp
    // 'string.pattern.base': `"Email" is invalid`,
    // }),
    birthday: Joi.string(),
    phone: Joi.string(),
    // .pattern().messages({
    //   phoneRegexp
    //   phoneRegexp
    //   'string.pattern.base': `"Phone" is invalid`,
    // }),
    skype: Joi.string(),
  }).validate(data);

const schemas = {
  registerSchema,
  loginSchema,
  updateUserProfileSchema,
};

module.exports = {
  schemas,
};
