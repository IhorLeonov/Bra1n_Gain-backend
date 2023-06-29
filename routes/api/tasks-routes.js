const express = require('express');
const router = express.Router();
const controller = require('../../controllers/tasks-controller');

//! У нас есть функция isValidId, которая проверят на валидность принимаемого в параметрах запроса id.
//! По идее она должна использоваться только здесь в tasks, т.к. только здесь используються параметры запроса (можешь другие роуты глянуть).
//! Ниже я показываю пример, где должна быть
const { validateBody, isValidId, authenticate } = require('../../middlewares');

const {
  schemaAddTask,
  schemaChangeTaskCategory,
} = require('../../models/task');

// Get all tasks
router.get('/', authenticate, controller.getTasks);

// Get task by id
router.get('/:id', authenticate, isValidId, controller.getTaskById); //! Например здесь должно быть так router.get('/:id', authenticate, isValidId, controller.getTaskById)

// Add task
router.post('/', authenticate, controller.addTask);

// Change task
router.put(
  '/:id',
  authenticate,
  isValidId,
  validateBody(schemaAddTask),
  controller.changeTask
);

// Change task category
router.patch(
  '/:id/category',
  authenticate,
  isValidId,
  validateBody(schemaChangeTaskCategory),
  controller.changeTaskCategory
);

// Delete task
router.delete('/:id', authenticate, isValidId, controller.deleteTask);

module.exports = router;
