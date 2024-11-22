const express = require("express");
const authRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { repay,getTransactionsByUserId } = require("../controllers/transaction.controller");

authRoutes.get("/:userId", [authMiddleware], getTransactionsByUserId);
authRoutes.post("/repay", [authMiddleware], repay);

module.exports = authRoutes;
