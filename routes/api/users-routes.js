const express = require('express');

const ctrl = require('../../controllers/users-controllers');

const {
    validateBody,
    authenticate,
    upload,
    validateUserProfile,
} = require('../../middlewares');

const { schemas } = require('../../schemas/user-schema');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);

router.patch(
    '/profile',
    authenticate,
    upload.single('avatarUrl'),

    // validateBody(schemas.validateUserProfile),
    validateUserProfile,
    ctrl.updateProfile
    // ctrl.updateUserAvatar
);

module.exports = router;
