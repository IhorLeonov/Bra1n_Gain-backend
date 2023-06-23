const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const fs = require('fs/promises');
const Jimp = require('jimp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
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
const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarsDir, filename);
    await fs.rename(oldPath, newPath);
    const avatarUrl = path.join('public', 'avatars', filename);

    const normalizedAvatar = Jimp.read(avatarUrl)
        .then(img => {
            return img.resize(250, 250).write(avatarUrl);
        })
        .catch(error => {
            throw new HttpError(404, `${error.message}`);
        });

    const result = await User.findByIdAndUpdate(_id, normalizedAvatar, {
        new: true,
    });

    if (!result) {
        throw new HttpError(404, 'Not found');
    }

    res.json({
        user: result.email,
        avatarURL: avatarUrl,
    });
};

const updateProfile = async (req, res) => {
    req.body.avatar = req.file?.path;

    const { name, email, birthday, token, phone, skype, avatarUrl } =
        await User.findByIdAndUpdate(req.user.id, req.body);

    res.status(200).json({
        user: { name, email, birthday, phone, skype, avatarUrl },
        token,
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateProfile: ctrlWrapper(updateProfile),
};
