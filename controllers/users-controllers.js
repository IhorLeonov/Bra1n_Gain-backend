const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const { catchAsync } = require('../utils');
const gravatar = require('gravatar');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  //! изменить на картинку гуся 
  //! и последнее - в самом конце, когда доделаем приложение до финала, можно сделать верификацию через email
  const avatarUrl = gravatar.url(email); 

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
      avatarUrl: user.avatarUrl
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
  if (req.file) {
    req.body.avatarUrl = req.file.path;
  }
  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select('-password -updatedAt -createdAt -token');

  res.status(200).json({
    data: user,
  });
});

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateProfile: ctrlWrapper(updateProfile),
};
