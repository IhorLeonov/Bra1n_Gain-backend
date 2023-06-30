const Joi = require('joi');

// const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const phoneRegexp = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
const phoneRegexp = /^\+\d{12}$/;
// const birthdayRegexp = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/;

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
    avatarUrl: Joi.string().optional(),
    // name: Joi.string(),
    // email: Joi.string(),
    // birthday: Joi.string(),
    // phone: Joi.string(),
    name: Joi.string().max(16).messages({
      'string.max': `"Name" should have a maximum length of {#limit}`,
      // 'any.required': `"Name" is a required field`,
    }),
    email: Joi.string().pattern(emailRegexp).messages({
      'string.pattern.base': `"Email" is invalid`,
      'string.empty': `"Email" cannot be an empty field`,
      // 'any.required': `"Email" is a required field`,
    }),
    birthday: Joi.string(),
    // .pattern(birthdayRegexp).optional().messages({
    //   'string.pattern.base': 'Date of birth must be in format YYYY-MM-DD',
    // }),
    phone: Joi.string().pattern(phoneRegexp).optional().messages({
      'string.pattern.base':
        'Phone number must start with "+" and contain 12 digits',
    }),
    skype: Joi.string().max(16).optional().messages({
      'string.max': `"Skype" should have a maximum length of {#limit}`,
    }),
  }).validate(data);

const schemas = {
  registerSchema,
  loginSchema,
  updateUserProfileSchema,
};

module.exports = {
  schemas,
};
