const expressAsyncHandler = require('express-async-handler');
const {
  show,
  showById,
  add,
  change,
  changeCategory,
  remove,
} = require('../services');
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
const getTasks = expressAsyncHandler(async (req, res) => {
  const { _id: owner } = req.user;
  const filter = getFilter({ ...req.query });
  const tasks = await show(owner, filter);

  res.status(200).json({ code: 200, data: tasks, count: tasks.length });
});

// Get task by id
const getTaskById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await showById(id);

  res.status(200).json({ code: 200, data: task });
});

// Add task
addTask = expressAsyncHandler(async (req, res) => {
  const { _id: owner } = req.user;
  const task = await add(owner, { ...req.body });

  res.status(201).json({ code: 201, data: task });
});

// Change task
const changeTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await change(id, { ...req.body });

  res.status(200).json({ code: 200, data: task });
});

// Change task category
const changeTaskCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await changeCategory(id, { ...req.body });

  res.status(200).json({ code: 200, data: task });
});

// Delete task
const deleteTask = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await remove(id);

  res.status(200).json({ code: 200, data: review });
});

module.exports = {
  getTasks,
  getTaskById,
  addTask,
  changeTask,
  changeTaskCategory,
  deleteTask,
};
