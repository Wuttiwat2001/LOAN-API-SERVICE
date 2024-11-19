const express = require("express");
const rootRouter = express.Router();
const authRoutes = require("./auth.routes");
const transactionRoutes = require("./transaction.routes");

rootRouter.use("/auth", authRoutes);
rootRouter.use("/transactions", transactionRoutes);

module.exports = rootRouter;
