const express = require("express");
const authRoutes = express.Router();
const { repay } = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth");

authRoutes.post("/repay", [authMiddleware], repay);

module.exports = authRoutes;
