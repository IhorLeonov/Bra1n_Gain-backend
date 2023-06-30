const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
const phoneRegexp = /^\+\d{12}$/;
const birthdayRegexp = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

const userSchema = new Schema(
    {
        name: {
            type: String,
            maxlength: 16,
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
            match: birthdayRegexp,
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
            maxlength: 16,
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
