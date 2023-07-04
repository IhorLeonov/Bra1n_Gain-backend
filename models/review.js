const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const reviewRateList = [1, 2, 3, 4, 5];

const reviewSchema = new Schema(
    {
        rate: {
            type: Number,
            enum: reviewRateList,
            required: [true, 'Set rate for app'],
        },
        comment: {
            type: String,
            required: [true, 'Set comment for app'],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { versionKey: false, timestamps: true }
);

reviewSchema.post('save', handleMongooseError);

const Review = model('reviews', reviewSchema);

module.exports = {
    Review,
    reviewRateList,
};
