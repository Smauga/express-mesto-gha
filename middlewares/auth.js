const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../token');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};
