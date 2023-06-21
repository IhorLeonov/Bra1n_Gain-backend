const Joi = require('joi');

const phoneRegex = /^((8|\+7)[ ]?)?(\(?\d{3}\)?[ ]?)?[\d\- ]{7,10}$/;
const phoneRegexError = {
    'string.pattern.base': `Incorrect phone number.`,
};

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().regex(phoneRegex).messages(phoneRegexError).required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
};

module.exports = {
    schemas,
};
