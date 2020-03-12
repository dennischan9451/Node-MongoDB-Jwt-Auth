const config = require('../config/app');
const logger = require('../utils/logger');
const NotifyResult = require('../results/notify');

// eslint-disable-next-line no-unused-vars
const handleError = (err, req, res, next) => {
  res.status(err.status || 500);

  if (err instanceof Error) {
    if (config.environment === 'development') {
      logger.error(err.stack);
    }

    res.json(new NotifyResult(err.message));
  } else {
    res.json(new NotifyResult('Unknown Error'));
  }
};

module.exports = handleError;
