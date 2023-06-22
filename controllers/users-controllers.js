const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const fs = require('fs/promises');
const Jimp = require('jimp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const avatarDir = path.join(__dirname, '../', 'public', 'avatars');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw new HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: {
            name: newUser.name,
            email: newUser.email,
            subscription: newUser.subscription,
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
        },
    });
};

const getCurrent = async (req, res) => {
    const { email, name, subscription } = req.user;

    res.json({
        email,
        name,
        subscription,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.json({
        message: 'Logout succeess',
    });
};

const updateProfile = async (req, res) => {
    const { _id } = req.user;
    const { name, email, birthday, phone, skype } = req.body;
    const { path: tempUpload, originalname } = req.file;
    const result = await User.findByIdAndUpdate(_id, req.body, {
        name: name,
        email: email,
        birthday: birthday,
        phone: phone,
        skype: skype,
    });
    await Jimp.read(`${tempUpload}`)
        .then(image => {
            return image.resize(250, 250).writeAsync(`${tempUpload}`); // save
        })
        .catch(err => {
            console.error(err);
        });
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ status: 'OK', avatarURL, result });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateProfile: ctrlWrapper(updateProfile),
};
