const Joi = require('joi');

const dataRegexp =
  /[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/;
const timeRegexp = /^([01]\d|2[0-3]):[0-5]\d$/;
const categoryType = ['to-do', 'in-progress', 'done'];
const priorityType = ['low', 'medium', 'high'];

const validateStartEndTime = (obj, helpers) => {
  function toMinute(time) {
    const arrTime = time.split(':');
    return Number(arrTime[0]) * 60 + Number(arrTime[1]);
  }
  const { start, end } = obj;

  if (toMinute(start) >= toMinute(end)) {
    return helpers.error('any.invalid');
  }
};

const schemaAddTask = Joi.object({
  title: Joi.string().max(250).required(),
  date: Joi.string().pattern(dataRegexp).min(10).max(10).required().messages({
    'string.pattern.base': `The field "date" must be of the following type "YYYY-MM-DD"`,
  }),
  start: Joi.string().pattern(timeRegexp).min(5).max(5).required().messages({
    'string.pattern.base': `The field "start" must be of the following type "hh:mm"`,
  }),

  end: Joi.string().pattern(timeRegexp).min(5).max(5).required().messages({
    'string.pattern.base': `The field "end" must be of the following type "hh:mm"`,
  }),
  priority: Joi.string()
    .valid(...priorityType)
    .required(),

  category: Joi.string()
    .valid(...categoryType)
    .required(),
})
  .custom(validateStartEndTime)
  .messages({
    'any.invalid': `The following condition must be met start<end`,
  });

const schemaChangeCategoryTask = Joi.object({
  category: Joi.string()
    .valid(...categoryType)
    .required(),
});

const schemas = {
  schemaAddTask,
  schemaChangeCategoryTask,
};

//! Глянь чо ета?))) Мне ошибки кидает на это в виде "model id not defined" и "taskSchema is not defined"
const modelTask = model('task', taskSchema); 

module.exports = {
  modelTask,
  schemas,
};
