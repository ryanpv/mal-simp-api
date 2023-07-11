const { body } = require('express-validator');

const validateCategoryCreate = [
  body('categoryName').notEmpty().isString().escape()
];

module.exports = {
  validateCategoryCreate
}