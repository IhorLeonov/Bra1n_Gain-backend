const Joi = require('joi');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
// const subscriptionList = ['starter', 'pro', 'business'];
// const phoneRegexp = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const updateUserProfileSchema = data =>
    Joi.object({
        name: Joi.string().required(),
        email: Joi.string().pattern(emailRegexp).required(),
        birthday: Joi.string(),
        // phone: Joi.string().pattern(phoneRegexp),
        phone: Joi.string(),
        skype: Joi.string(),
        avatarURL: Joi.string(),
    }).validate(data);

const schemas = {
    registerSchema,
    loginSchema,
    updateUserProfileSchema,
};

module.exports = {
    schemas,
};
