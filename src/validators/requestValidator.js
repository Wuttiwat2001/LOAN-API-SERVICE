const { body, param } = require("express-validator");

const validateRequestBorrow = [
    body("senderId")
      .isInt().withMessage("Sender ID ต้องเป็นตัวเลข")
      .notEmpty().withMessage("กรุณาระบุ Sender ID"),
    body("receiverId")
      .isInt().withMessage("Receiver ID ต้องเป็นตัวเลข")
      .notEmpty().withMessage("กรุณาระบุ Receiver ID"),
    body("amount")
      .isFloat({ gt: 0 }).withMessage("Amount ต้องเป็นจำนวนเงินที่มากกว่า 0")
      .notEmpty().withMessage("กรุณาระบุ Amount"),
    body("description")
      .isString().withMessage("Description ต้องเป็นตัวอักษร")
      .optional(),
  ];

const validateApproveOrRejectRequest = [
  param("id").isInt().withMessage("ID ต้องเป็นตัวเลข"),
  body("status")
    .notEmpty().withMessage("กรุณาระบุสถานะ")
    .isIn(["อนุมัติ", "ปฏิเสธ"]).withMessage("สถานะไม่ถูกต้อง"),
];

module.exports = { validateRequestBorrow,validateApproveOrRejectRequest };