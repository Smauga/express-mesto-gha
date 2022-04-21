const INPUT_ERROR = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const handleError = (err, res) => {
  if (err.name === 'ValidationError') return res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные' });
  if (err.name === 'CastError') return res.status(NOT_FOUND).send({ message: 'Карточка или пользователь не найден' });
  return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};

module.exports = { handleError };
