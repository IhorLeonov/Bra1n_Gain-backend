const expressAsyncHandler = require('express-async-handler');
const tasksServices = require('../services');
const getCurentMonth = require('../helpers/dataTime');

const getFilter = params => {
    const { day, month } = params;

    let filter = '';
    if (day) {
        filter = day;
    } else if (month) {
        folter = month.slice(0, 8);
    } else {
        filter = getCurentMonth();
    }

    return filter;
};

class ControllerTasks {
    // Get all tasks
    getTasks = expressAsyncHandler(async (req, res) => {
        const { _id: owner } = req.user;
        const filter = getFilter({ ...req.query });
        const tasks = await tasksServices.show(owner, filter);

        res.status(200).json({ code: 200, data: tasks, count: tasks.length });
    });

    // Get task by id
    getTaskById = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const task = await tasksServices.showById(id);

        res.status(200).json({ code: 200, data: task });
    });

    // Add task
    addTask = expressAsyncHandler(async (req, res) => {
        const { _id: owner } = req.params;
        const task = await tasksServices.add(owner, { ...req.body });

        res.status(200).json({ code: 200, data: task });
    });

    // Change task
    changeTask = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const task = await tasksServices.change(id, { ...req.body });

        res.status(200).json({ code: 200, data: task });
    });

    // Change task category
    changeTaskCategory = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const task = await tasksServices.changeCategory(id, { ...req.body });

        res.status(200).json({ code: 200, data: task });
    });

    // Delete task
    deleteTask = expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const review = await tasksServices.remove(id);

        res.status(200).json({ code: 200, data: review });
    });
}

const controllerTasks = new ControllerTasks();
module.exports = controllerTasks;
