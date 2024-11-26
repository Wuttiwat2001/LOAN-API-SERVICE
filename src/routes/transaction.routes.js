const express = require("express");
const transactionRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const {
  repay,
  getTransactionsByUserId,
  getTransactionSenderByUserId,
} = require("../controllers/transaction.controller");
const {
  validateTransactions,
} = require("../validators/transactionValidator");

const validationMiddleware = require("../middlewares/validation");

transactionRoutes.post(
  "/",
  [authMiddleware, paginationMiddleware],
  validateTransactions,
  validationMiddleware,
  getTransactionsByUserId
);

transactionRoutes.post(
  "/sender",
  [authMiddleware, paginationMiddleware],
  validateTransactions,
  validationMiddleware,
  getTransactionSenderByUserId
);


transactionRoutes.post("/repay", [authMiddleware], repay);

module.exports = transactionRoutes;
