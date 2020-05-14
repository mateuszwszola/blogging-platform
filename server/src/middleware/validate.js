const { validationResult } = require('express-validator');

const errorFormatter = ({ msg }) => msg;

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req).formatWith(errorFormatter);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.mapped() });
  };
};

module.exports.validate = validate;
