const express = require("express");
const authRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { repay } = require("../controllers/transaction.controller");

authRoutes.post("/repay", [authMiddleware], repay);

module.exports = authRoutes;
