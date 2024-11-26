const express = require("express");
const transactionRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const {
  repay,
  getTransactionsByUserId,
} = require("../controllers/transaction.controller");
const {
  validateGetTransactionsByUserId,
} = require("../validators/transactionValidator");

const validationMiddleware = require("../middlewares/validation");

transactionRoutes.post(
  "/",
  [authMiddleware, paginationMiddleware],
  validateGetTransactionsByUserId,
  validationMiddleware,
  getTransactionsByUserId
);
transactionRoutes.post("/repay", [authMiddleware], repay);

module.exports = transactionRoutes;
