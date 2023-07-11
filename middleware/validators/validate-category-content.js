const { param } = require('express-validator');

const validateCategoryContent = [
  param('categoryName').exists().escape()
];

module.exports = {
  validateCategoryContent
}