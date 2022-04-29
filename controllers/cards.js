const Card = require('../models/card');
const { handleError } = require('../errors/handleError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new NotFoundError('Карточки не существует'))
          .then((deletedCard) => res.send(deletedCard))
          .catch((err) => handleError(err, res));
      } else (console.log(1));
    })
    .catch((err) => handleError(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточки не существует'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточки не существует'))
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
