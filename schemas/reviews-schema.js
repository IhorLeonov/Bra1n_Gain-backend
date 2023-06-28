const Joi = require('joi');
const { reviewRateList } = require('../models/review');

const reviewSchema = Joi.object({
    rate: Joi.number()
        .required()
        .valid(...reviewRateList)
        .messages({
            'any.only': 'rate is incorrect',
            "any.required": `"rate" is a required field`,
        }),
    comment: Joi.string().required().messages({
        'string.empty': `"comment" cannot be an empty field`,
        'any.required': `"comment" is a required field`,
    }),
});

const schemas = {
    reviewSchema,
};

module.exports = {
    schemas,
};
