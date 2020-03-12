const { createLogger, format, transports } = require('winston');

const {
  combine, colorize, printf,
} = format;

const myFormat = printf(({ message }) => message);

const logger = createLogger({
  transports: [
    new transports.Console(),
  ],
  format: combine(
    colorize({ all: true }),
    myFormat,
  ),
});

module.exports = logger;
