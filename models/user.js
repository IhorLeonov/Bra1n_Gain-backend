const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
const phoneRegexp = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
// const subscriptionList = ['starter', 'pro', 'business'];

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            match: emailRegexp,
            unique: true,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            minlength: 6,
            required: [true, 'Password is required'],
        },
        birthday: {
            type: String,
            required: false,
            default: '',
        },
        phone: {
            type: String,
            match: phoneRegexp,
            required: false,
            default: '',
        },
        skype: {
            type: String,
            required: false,
            default: '',
        },
        avatarUrl: {
            type: String,
            required: false,
        },
        token: {
            type: String,
            default: '',
        },
    },
    { versionKey: false, timestamps: true }
);

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = {
    User,
};
