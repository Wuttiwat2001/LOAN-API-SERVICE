const { body } = require("express-validator");

const validateLogin = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

const signupValidationRules = () => {
  return [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ];
};

module.exports = { validateLogin, signupValidationRules };
