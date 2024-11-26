const express = require("express");
const transactionRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const {
  repay,
  getTransactionsByUserId,
  getTransactionSenderByUserId,
  getTransactionReceiverByUserId,
} = require("../controllers/transaction.controller");
const {
  validateRepay,
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

transactionRoutes.post(
  "/receiver",
  [authMiddleware, paginationMiddleware],
  validateTransactions,
  validationMiddleware,
  getTransactionReceiverByUserId
);

transactionRoutes.post(
  "/repay",
  [authMiddleware],
  validateRepay,
  validationMiddleware,
  repay
);

module.exports = transactionRoutes;
