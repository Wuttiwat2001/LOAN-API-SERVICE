const {  param } = require("express-validator");
const validateUserId = [
  param("userId")
    .isInt()
    .withMessage("User ID ต้องเป็นตัวเลข")
    .notEmpty()
    .withMessage("กรุณาระบุ User ID"),
];

module.exports = {
  validateUserId
};