const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError } = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');
const JWT_SECRET = require('../token');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь не существует'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не существует'))
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const createUser = (req, res) => {
  const { email, password } = req.body;
  if (isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({ email, password: hash })
          .then((user) => res.send(
            {
              email: user.email,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
            },
          ))
          .catch((err) => handleError(err, res));
      })
      .catch((err) => handleError(err, res));
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
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
