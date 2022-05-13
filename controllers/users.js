const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const EmailError = require('../errors/EmailError');
const DataError = require('../errors/DataError');
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не существует');
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректный id пользователя'));
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send(
          {
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          },
        ))
        .catch((err) => {
          if (err.code === 11000) next(new EmailError('Некорректный e-mail'));
          if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          })
      .end();
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') next(new DataError('Некорректные данные'));
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
