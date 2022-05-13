const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  try {

    const token = req.cookies.jwt;
    const jwtScret = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

    if (!token) throw new UnauthorizedError('Необходима авторизация');

    let payload;

    try {
      payload = jwt.verify(token, jwtScret);
    } catch (err) {
      throw new AuthError('Необходима авторизация');
    }

    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
};
