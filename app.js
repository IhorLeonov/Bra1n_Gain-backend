const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/api/users-routes');
const tasksRouter = require('./routes/api/tasks-routes');
// const contactsRouter = require('./routes/api/contacts-routes');
const reviewsRouter = require('./routes/api/reviews-routes');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', usersRouter);
// app.use('/api/contacts', contactsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/reviews', reviewsRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message });
});

module.exports = app;
