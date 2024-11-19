const express = require("express");
const authRoutes = express.Router();
const { repay } = require("../controllers/transaction");
const authMiddleware = require("../middlewares/auth");

authRoutes.post("/repay", [authMiddleware], repay);

module.exports = authRoutes;
