const Joi = require("joi");

const validationMiddleware = (schema, prop) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((info) => info.join(","));
      const err = new Error(message);
      next(err);
    }
  };
};

module.exports = validationMiddleware;
