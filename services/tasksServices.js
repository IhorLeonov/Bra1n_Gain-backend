const { Task } = require('../models/task');
const { HttpError } = require('../helpers');

const show = async (owner, filter) => {
  const tasks = await Task.find(
    { owner, date: { $regex: filter, $options: 'i' } },
    '-createdAt -updatedAt -__v'
  );

  if (!tasks) {
    throw HttpError(400, 'Unable to fetch Tasks');
  }

  return tasks;
};

const showById = async id => {
  const task = await Task.findById(id, '-createdAt -updatedAt -__v');

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  return task;
};

const add = async (owner, data) => {
  const tasks = await Task.create({ ...data, owner });

  if (!tasks) {
    throw HttpError(400, 'Unable to save to the database');
  }

  const { createdAt, updatedAt, __v, ...createdTask } = tasks.toObject();

  return createdTask;
};

const change = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, {
    new: true,
    select: '-createdAt -updatedAt -__v',
  });

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  return task;
};

const changeCategory = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, {
    new: true,
    select: '-createdAt -updatedAt -__v',
  });

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  return task;
};

const remove = async id => {
  const task = await Task.findByIdAndDelete(id, {
    select: '-createdAt -updatedAt -__v',
  });

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  return task;
};

module.exports = { show, showById, add, change, changeCategory, remove };
