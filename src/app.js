const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('morgan');

const handleError = require('./middleware/handleError');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(cors({
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
}));

// routes setup
app.use('/', indexRouter);
app.use('/api/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(handleError);

module.exports = app;
