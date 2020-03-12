const Joi = require('@hapi/joi');
const CustomJoi = require('../utils/customJoi');

const register = (value) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string()
      .required(),
  });

  return schema.validate(value);
};

const login = (value) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .required(),
    password: Joi.string()
      .required(),
  });

  return schema.validate(value);
};

const findUserById = (value) => {
  const schema = Joi.object().keys({
    id: CustomJoi.objectId()
      .required()
      .prefs({ convert: true }),
  });

  return schema.validate(value);
};

module.exports = {
  register,
  login,
  findUserById,
};
