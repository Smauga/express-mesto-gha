const { isURL } = require('validator');
const DataError = require('../errors/DataError');

const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new DataError('Неправильный формат ссылки');
  }
  return value;
};

module.exports = { validateURL };
