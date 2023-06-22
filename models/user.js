const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
const subscriptionList = ['starter', 'pro', 'business'];

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
        subscription: {
            type: String,
            enum: subscriptionList,
            default: 'starter',
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
