const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleError } = require('./errors/handleError');
const NotFoundError = require('./errors/NotFoundError');
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[\w-._~:/?#[\]@!$&'()*+,;=]+/),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => next(new NotFoundError('Адрес не существует')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(PORT);
