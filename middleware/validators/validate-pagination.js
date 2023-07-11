const { param } = require('express-validator');

const validatePagination = [
  param('categoryName').exists().isString().escape(),
  param('lastItem').exists().isString().escape()
];

module.exports = {
  validatePagination
}