const { Task } = require('../models/task');
const { HttpError, ctrlWrapper } = require('../helpers');
const getCurentMonth = require('../helpers/dataTime');

const getFilter = params => {
  const { day, month } = params;

  let filter = '';
  if (day) {
    filter = day;
  } else if (month) {
    filter = month.slice(0, 8);
  } else {
    filter = getCurentMonth();
  }

  return filter;
};

// Get all tasks
const getTasks = async (req, res) => {
  const { _id: owner } = req.user;
  const filter = getFilter({ ...req.query });
  const tasks = await Task.find(
    { owner, date: { $regex: filter, $options: 'i' } },
    '-createdAt -updatedAt -__v'
  );

  if (!tasks) {
    throw HttpError(400, 'Unable to fetch Tasks');
  }

  res.status(200).json({ code: 200, data: tasks, count: tasks.length });
};

// Get task by id
const getTaskById = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id, '-createdAt -updatedAt -__v');

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  res.status(200).json({ code: 200, data: task });
};

// Add task
const addTask = async (req, res) => {
  const { _id: owner } = req.user;
  const task = await Task.create({ ...req.body, owner });

  if (!task) {
    throw HttpError(400, 'Unable to save to the database');
  }

  res.status(201).json({ code: 201, task });
};

// Change task
const changeTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
      select: '-createdAt -updatedAt -__v',
    }
  );

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  res.status(200).json({ code: 200, data: task });
};

// Change task category
const changeTaskCategory = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    select: '-createdAt -updatedAt -__v',
  });

  if (!task) {
    throw HttpError(400, 'Unable to find task');
  }

  res.status(200).json({ code: 200, data: task });
};

// Delete task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id, {
    select: '-createdAt -updatedAt -__v',
  });

  if (!task) {
    throw new HttpError(400, 'Unable to find task');
  }

  res.status(200).json({ code: 200, data: task });
};

module.exports = {
  getTasks: ctrlWrapper(getTasks),
  getTaskById: ctrlWrapper(getTaskById),
  addTask: ctrlWrapper(addTask),
  changeTask: ctrlWrapper(changeTask),
  changeTaskCategory: ctrlWrapper(changeTaskCategory),
  deleteTask: ctrlWrapper(deleteTask),
};
