const { body } = require('express-validator');

const validateLogin = [
  body('username').isString().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

module.exports = { validateLogin };