const { ctrlWrapper, HttpError } = require('../helpers');
const { Review } = require('../models/review');

const getAllReviews = async (_, res) => {
    const reviews = await Review.find().populate("owner", "name avatarUrl");

    if (reviews.length === 0) {
        return res.json({ message: 'There are no reviews' });
    }

    res.json(reviews);
};

const getOwnReview = async (req, res) => {
    const { _id: owner } = req.user;

    const ownReview = await Review.findOne({ owner }).populate("owner", "name avatarUrl");

    if (!ownReview) {
        throw new HttpError(404, 'Review not found or does not exist');
    }

    res.json(ownReview);
};

const addOwnReview = async (req, res) => {
    const { rate, comment } = req.body;
    const { _id: owner} = req.user;

    const existingReview = await Review.findOne({ owner });

    if (existingReview) {
        throw new HttpError(400, 'You have already left a review');
    }

    await Review.create({ owner, rate, comment });
        
    const review = await Review.find({owner}).populate("owner", "name avatarUrl");

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
        message: 'Review deleted',
    });
};

module.exports = {
    getAllReviews: ctrlWrapper(getAllReviews),
    getOwnReview: ctrlWrapper(getOwnReview),
    addOwnReview: ctrlWrapper(addOwnReview),
    updateOwnReview: ctrlWrapper(updateOwnReview),
    deleteOwnReview: ctrlWrapper(deleteOwnReview),
};
