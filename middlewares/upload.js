const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//! Поменял немного код. Теперь изображение должно изменять свои размеры перед сохранением в cloudinary.
//! Проверь - должно работать.
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars',
        allowed_formats: ['jpg', 'png'],
        transformation: [
            {
                width: 500, //! Ширина обрезанного изображения, можешь выставить другое
                height: 500, //! Высота обрезанного изображения, можешь выставить другое
                crop: 'fill', //! Обрезка изображения (с сохранением пропорций)
            },
        ],
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
