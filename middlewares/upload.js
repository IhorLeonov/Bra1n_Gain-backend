const multer = require('multer');
const path = require('path');

const { HttpError } = require('../helpers');

const destination = path.resolve('temp');
const dateNow = new Date().toLocaleDateString('en-GB').split('/').join('-');

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePrefix = dateNow + '_' + Math.round(Math.random() * 1e3);
        const newName = `${uniquePrefix}_${file.originalname}`;
        cb(null, newName);
    },
});

const limits = {
    fileSize: 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
    const { mimetype } = file;
    if (mimetype === 'image/jpeg' || mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(
            new HttpError(400, 'File can have only .jpeg or .png extension'),
            false
        );
    }
};

const upload = multer({
    storage,
    limits,
    fileFilter,
});

module.exports = upload;
