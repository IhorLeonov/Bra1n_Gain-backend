const { ctrlWrapper, HttpError } = require('../helpers');
const { Review } = require('../models/review');

const getAllReviews = async (_, res) => {
    const reviews = await Review.find();

    if (reviews.length === 0) {
        return res.json({ message: 'There are no reviews' });
    }

    res.json(reviews);
};

const getOwnReview = async (req, res) => {
    const { _id: owner } = req.user;

    const ownReview = await Review.findOne({ owner });

    if (!ownReview) {
        throw new HttpError(404, 'Review not found or does not exist');
    }

    res.json(ownReview);
};

const addOwnReview = async (req, res) => {
    const { rate, comment } = req.body;
    const { _id: owner, name, avatarUrl} = req.user;

    const existingReview = await Review.findOne({ owner });

    if (existingReview) {
        throw new HttpError(400, 'You have already left a review');
    }

    const dataReview = new Review({ owner, name, avatarUrl, rate, comment });
    const review = await dataReview.save();

    res.status(201).json(review);
};

const updateOwnReview = async (req, res) => {
    const { rate, comment } = req.body;
    const { _id: owner } = req.user;

    const existingReview = await Review.findOne({ owner });

    if (!existingReview) {
        throw new HttpError(404, 'Review not found or does not exist');
    }

    existingReview.rate = rate;
    existingReview.comment = comment;

    const updatedReview = await existingReview.save();

    res.json(updatedReview);
};

const deleteOwnReview = async (req, res) => {
    const { _id: owner } = req.user;

    const existingReview = await Review.findOneAndDelete({ owner });

    if (!existingReview) {
        throw new HttpError(404, 'Review not found or does not exist');
    }

    res.json({
        message: 'Contact deleted',
    });
};

module.exports = {
    getAllReviews: ctrlWrapper(getAllReviews),
    getOwnReview: ctrlWrapper(getOwnReview),
    addOwnReview: ctrlWrapper(addOwnReview),
    updateOwnReview: ctrlWrapper(updateOwnReview),
    deleteOwnReview: ctrlWrapper(deleteOwnReview),
};
