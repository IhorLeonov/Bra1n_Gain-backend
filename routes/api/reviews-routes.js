const express = require('express');
const ctrl = require('../../controllers/reviews-controllers');
const { authenticate, validateBody } = require('../../middlewares');
const { schemas } = require('../../schemas/reviews-schema');

const router = express.Router();

router.get('/', ctrl.getAllReviews);

router.get('/own', authenticate, ctrl.getOwnReview);

router.post(
    '/own',
    authenticate,
    validateBody(schemas.reviewSchema),
    ctrl.addOwnReview
);

router.patch(
    '/own',
    authenticate,
    validateBody(schemas.reviewSchema),
    ctrl.updateOwnReview
);

router.delete('/own', authenticate, ctrl.deleteOwnReview);

module.exports = router;
