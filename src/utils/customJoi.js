const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');

const customJoi = Joi
  .extend((joi) => ({
    type: 'objectId',
    base: joi.string(),
    messages: {
      objectId: 'Invalid ObjectId',
    },
    validate(value, helpers) {
      if (!ObjectId.isValid(value)) {
        return { value, errors: helpers.error('objectId') };
      }
      return ObjectId(value);
    },
  }));

module.exports = customJoi;
