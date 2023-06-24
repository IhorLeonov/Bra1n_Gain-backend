const { HttpError } = require('../helpers');
const { schemas } = require('../schemas/user-schema');
const { catchAsync } = require('../utils');

const validateUserProfile = catchAsync(async (req, res, next) => {
    const { error, value } = schemas.updateUserProfileSchema(req.body);

    if (error) return next(HttpError.BadRequest(error.details[0].message));

    req.body = value;

    next();
});

module.exports = validateUserProfile;
