const { body } = require('express-validator');

const validateSavedAnime = [
  body().isObject(),
  body('animeTitle').notEmpty().escape(),
  body('categoryName').notEmpty().escape(),
  body('animeId').isInt(),
  body('num_episodes').isInt(),
  body('main_picture').notEmpty().isObject(),
  body('mean').isFloat(),
]

module.exports = {
  validateSavedAnime
}