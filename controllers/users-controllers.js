const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const { catchAsync } = require('../utils');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const defaultAvatar =
  'https://cdn-icons-png.flaticon.com/512/424/424792.png?w=740&t=st=1688068895~exp=1688069495~hmac=ca26790f6996963b36060759faa8d3f9a08cfbbcf2f14f62684885583ab495be';

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const avatarUrl = defaultAvatar;

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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Email or password is wrong');
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

const updateUserPassword = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const { email, password, newPassword } = req.body;

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, 'Email or password is wrong');
  }
  const hashPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(_id, {
    password: hashPassword,
  });

  res.status(200).json({ email, message: 'Change password success' });
});

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateProfile: ctrlWrapper(updateProfile),
  updateUserPassword: ctrlWrapper(updateUserPassword),
};
