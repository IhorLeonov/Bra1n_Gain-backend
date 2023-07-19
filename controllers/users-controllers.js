const { User } = require('../models/user');
const { ctrlWrapper, HttpError, sendEmail } = require('../helpers');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const queryString = require('query-string');
const axios = require('axios');

const { Review } = require('../models/review');
const { nanoid } = require('nanoid');

const {
  SECRET_KEY,
  DEFAULT_AVATAR_URL,
  PROJECT_URL,
  BASE_URL,
  GOOGLE_CLIENT_ID,
} = process.env;

const googleAuth = async (req, res) => {
  console.log('queryString', queryString);
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/users/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });

  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  console.log(userData);

  // userData.data.email
  // ...
  // ...
  // ...

  return res.redirect(
    `${PROJECT_URL}/google-redirect/?email=${userData.data.email}`
  );
};

// const register = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   const avatarUrl = DEFAULT_AVATAR_URL;

//   if (user) {
//     throw new HttpError(409, 'Email already in use');
//   }

//   const hashPassword = await bcrypt.hash(password, 10);

//   const newUser = await User.create({
//     ...req.body,
//     password: hashPassword,
//     avatarUrl,
//   });

//   const payload = {
//     id: newUser._id,
//   };

//   const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
//   await User.findByIdAndUpdate(newUser._id, { token });

//   res.status(201).json({
//     token,
//     user: {
//       name: newUser.name,
//       email: newUser.email,
//       avatarUrl,
//       createdAt: newUser.createdAt,
//     },
//   });
// };

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, 'Email already in use');
  }

  if (user && !user.verify) {
    throw new HttpError(401, 'This email exists, but it is not verified');
  }

  const avatarUrl = DEFAULT_AVATAR_URL;
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${PROJECT_URL}/verification/${verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatarUrl,
      createdAt: newUser.createdAt,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw new HttpError(401, 'Email not found');
  }

  if (user.verify) {
    throw new HttpError(401, 'Email already verify');
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  const verifiedUser = await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: null,
    token,
  });

  res.json({
    token,
    user: {
      name: verifiedUser.name,
      email: verifiedUser.email,
      avatarUrl: verifiedUser.avatarUrl,
    },
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Email not found');
  }

  if (user.verify) {
    throw new HttpError(401, 'Email already verify');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${PROJECT_URL}/verification/${user.verificationCode}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email send success',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'User with this email address not found');
  }

  if (!user.verify) {
    throw new HttpError(401, 'Email not verified');
  }

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

const updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { birthday, name, avatarUrl, email } = req.body;

  if (req.file) {
    req.body.avatarUrl = req.file.path;
  }

  const user = await User.findById(_id).select('createdAt');
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

  if (email) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new HttpError(400, 'This email is already in the database');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select('-password -updatedAt -createdAt -token');

  // Check if the user has any reviews
  const existingReview = await Review.findOne({ owner: _id });
  if (existingReview && (name || avatarUrl)) {
    await Review.updateOne({ owner: _id }, { $set: { name, avatarUrl } });
  }

  res.status(200).json({
    data: updatedUser,
  });
};

const updateUserPassword = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const { email, password, newPassword } = req.body;

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(400, 'Bad Request: email or password is wrong');
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(_id, {
    password: hashPassword,
  });

  res.status(200).json({ email, message: 'Change password success' });
};

module.exports = {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateProfile: ctrlWrapper(updateProfile),
  updateUserPassword: ctrlWrapper(updateUserPassword),
};
