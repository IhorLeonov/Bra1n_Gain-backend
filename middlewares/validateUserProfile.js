const { HttpError } = require('../helpers');
const { schemas } = require('../schemas/user-schema');

const validateUserProfile = async (req, _, next) => {
    const { error, value } = schemas.updateUserProfileSchema(req.body);

    if (error) {
        const errorMessage = error.details
            .map(({ message }) => message)
            .join(';   ');
        return next(new HttpError(400, errorMessage));
    }

    req.body = value;

    next();
};

module.exports = validateUserProfile;
