const express = require("express");
const authRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const { repay,getTransactionsByUserId } = require("../controllers/transaction.controller");

authRoutes.get("/:userId", [authMiddleware,paginationMiddleware], getTransactionsByUserId);
authRoutes.post("/repay", [authMiddleware], repay);

module.exports = authRoutes;
