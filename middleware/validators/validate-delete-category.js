const { param } = require('express-validator');

const validateDeleteCategory = [
  param('categoryName').exists().isString().escape(),
];

module.exports = {
  validateDeleteCategory
}