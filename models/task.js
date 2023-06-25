const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const dataRegexp =
    /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/;
const timeRegexp = /^([01]\d|2[0-3]):[0-5]\d$/;
const categoryType = ['to-do', 'in-progress', 'done'];
const priorityType = ['low', 'medium', 'high'];

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'DB title is required'],
        },
        date: {
            type: String,
            required: [true, 'DB: Date is required'],
            match: dataRegexp, // YYYY-MM-DD
        },
        start: {
            type: String,
            required: [true, 'DB Start is required'],
            match: timeRegexp, //  09:00
        },
        end: {
            type: String,
            required: [true, 'DB End is required'],
            match: timeRegexp, //  09:00
        },
        priority: {
            type: String,
            required: [true, 'DB: Priority is required'],
            enum: priorityType,
            default: priorityType[0], // low | medium | high
        },
        category: {
            type: String,
            required: [true, 'DB: Category is required'],
            enum: categoryType,
            default: categoryType[0], // to-do | in-progress | done
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true, 'Set owner contact'],
        },
    },
    { versionKey: false, timestamps: true }
);

taskSchema.post('save', handleMongooseError);

const Task = model('task', taskSchema);

module.exports = {
    Task,
};
