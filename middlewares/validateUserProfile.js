const { HttpError } = require('../helpers');
const { schemas } = require('../schemas/user-schema');

const validateUserProfile = async (req, res, next) => {
  const { error, value } = schemas.updateUserProfileSchema(req.body);

  if (error) return next(new HttpError(400, error.details[0].message));
  req.body = value;
  next();
};

module.exports = validateUserProfile;
