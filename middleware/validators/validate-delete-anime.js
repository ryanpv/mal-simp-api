const { body } = require('express-validator');

const validateDeleteAnime = [
  body('categoryName').exists().notEmpty().isString().escape(),
  body('animeId').isInt().escape(),
];

module.exports = {
  validateDeleteAnime
}