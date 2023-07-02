const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const { catchAsync } = require('../utils');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, DEFAULT_AVATAR_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const avatarUrl = DEFAULT_AVATAR_URL;

  if (user) {
    throw new HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
  });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarUrl,
      createdAt: newUser.createdAt,
    },
  });
};

// const register = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (user) {
//     throw new HttpError(409, 'Email already in use');
//   }

//   const avatarUrl = DEFAULT_AVATAR_URL;
//   const hashPassword = await bcrypt.hash(password, 10);
//   const verificationCode = nanoid();

//   const newUser = await User.create({
//     ...req.body,
//     password: hashPassword,
//     avatarUrl,
//     verificationCode,
//   });

//   const verifyEmail = {
//     to: email,
//     subject: 'Verify email',
//     html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${verificationCode}">Click verify email</a>`,
//   };

//   const data = await sendEmail(verifyEmail);
//   console.log('data =>', data);

//   res.status(201).json({
//     user: {
//       name: newUser.name,
//       email: newUser.email,
//       avatarUrl,
//       createdAt: newUser.createdAt,
//     },
//   });
// };

// const verifyEmail = async (req, res) => {
//   const { verificationCode } = req.params;
//   const user = await User.findOne({ verificationCode });

//   if (!user) {
//     throw HttpError(401, 'Email not found');
//   }

//   await User.findByIdAndUpdate(user._id, {
//     verify: true,
//     verificationCode: null,
//   });

//   res.json({
//     message: 'Email verify success',
//   });
// };

// const resendVerifyEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw HttpError(401, 'Email not found');
//   }

//   if (user.verify) {
//     throw HttpError(401, 'Email already verify');
//   }

//   const verifyEmail = {
//     to: email,
//     subject: 'Verify email',
//     html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
//   };

//   await sendEmail(verifyEmail);

//   res.json({
//     message: 'Verify email send success',
//   });
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  // if (!user.verify) {
  //   throw new HttpError(401, 'Email not verified');
  // }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      avatarUrl: user.avatarUrl,
    },
  });
};

const getCurrent = async (req, res) => {
  const { name, email, birthday, token, phone, skype, avatarUrl } = req.user;

  res.json({
    status: 'success',
    code: 200,
    user: {
      name,
      birthday,
      email,
      phone,
      skype,
      avatarUrl,
    },
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });

  res.json({
    message: 'Logout succeess',
  });
};

const updateProfile = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id).select('createdAt');

  if (req.file) {
    req.body.avatarUrl = req.file.path;
  }

  const { birthday } = req.body;
  if (birthday) {
    const registrationDate = new Date(user.createdAt);
    const userBirthday = new Date(birthday);

    if (userBirthday > registrationDate) {
      throw new HttpError(
        400,
        'Date of birth cannot be later than the date of registration'
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select('-password -updatedAt -createdAt -token');

  res.status(200).json({
    data: updatedUser,
  });
});

module.exports = {
  register: ctrlWrapper(register),
  // verifyEmail: ctrlWrapper(verifyEmail),
  // resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateProfile: ctrlWrapper(updateProfile),
};
