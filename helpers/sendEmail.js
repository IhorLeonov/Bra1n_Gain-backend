// SendGrid way

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

// const data = {
//     to: 'vejope2488@soremap.com',
//     from: 'pancishi1@gmail.com',
//     subject: 'Test email',
//     html: '<p><strong>Test email</strong> from localhost:3000</p>',
// };

const sendEmail = async data => {
    const email = { ...data, from: 'pancishi1@gmail.com' };
    await sgMail.send(email);
    return true;
};

module.exports = sendEmail;

// Nodemailer way - подключаемся к почтовому серверу

// 1. npm i nodemailer
// 2. add "META_PASSWORD=Pass12345" to env

// const nodemailer = require('nodemailer');
// const { META_PASSWORD } = process.env;

// const nodemailerConfig = {
//     host: 'smtp.meta.ua',
//     port: 465, // (25, 465, 2525) - 465й требует шифрование
//     secure: true,
//     auth: {
//         user: 'ihor_leonov@meta.ua',
//         pass: META_PASSWORD,
//     },
// };
// const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//     to: 'vejope2488@soremap.com',
//     from: 'ihor_leonov@meta.ua',
//     subject: 'Test email',
//     html: '<p><strong>Test email</strong> from localhost:3000</p>',
// };

// transport
//     .sendMail(email)
//     .then(() => console.log('Email send success'))
//     .catch(error => console.log(error.message));
