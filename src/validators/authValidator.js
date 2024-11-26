const { body,query } = require("express-validator");

const validateLogin = [
  body("username")
    .isString().withMessage("ชื่อผู้ใช้ต้องเป็นตัวอักษร")
    .notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
  body("password")
    .isString().withMessage("รหัสผ่านต้องเป็นตัวอักษร")
    .notEmpty().withMessage("กรุณากรอกรหัสผ่าน"),
];

const validationSignup = [
  body("username")
    .notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้")
    .isLength({ min: 4 }).withMessage("ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร")
    .isLength({ max: 20 }).withMessage("ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร"),
  body("email")
    .isEmail().withMessage("กรุณากรอกอีเมลที่ถูกต้อง"),
  body("password")
    .notEmpty().withMessage("กรุณากรอกรหัสผ่าน")
    .isLength({ min: 8 }).withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  body("firstName")
    .notEmpty().withMessage("กรุณากรอกชื่อจริง"),
  body("lastName")
    .notEmpty().withMessage("กรุณากรอกนามสกุล"),
  body("phone")
    .notEmpty().withMessage("กรุณากรอกหมายเลขโทรศัพท์")
    .isLength({ min: 9, max: 9 }).withMessage("หมายเลขโทรศัพท์ต้องมี 9 ตัวอักษร"),
];

module.exports = { validateLogin, validationSignup };