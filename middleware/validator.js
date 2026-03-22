const Joi = require("joi");

const validatorTodo = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100).required(),
    completed: Joi.boolean().default(false),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

const patchValidator = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100),
    completed: Joi.boolean(),
  }).unknown(false);

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = { validatorTodo, patchValidator };
