const handleError = (err, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }
  if (err.name === 'NotFoundError') {
    return res.status(404).send({ message: err.message });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

module.exports = { handleError };
