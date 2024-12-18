const { body, query } = require("express-validator");

const validateTransactions = [
  body("userId")
    .isInt()
    .withMessage("User ID ต้องเป็นตัวเลข")
    .notEmpty()
    .withMessage("กรุณาระบุ User ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 1"),
  query("pageSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page Size ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 1"),
];

const validateRepay = [
  body("transactionId")
    .isInt()
    .withMessage("Transaction ID ต้องเป็นตัวเลข")
    .notEmpty()
    .withMessage("กรุณาระบุ Transaction ID"),
];


module.exports = {
  validateTransactions,
  validateRepay
};
