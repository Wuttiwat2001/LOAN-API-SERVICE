const express = require("express");
const rootRouter = express.Router();
const authRoutes = require("./auth");
const transactionRoutes = require("./transaction");

rootRouter.use("/auth", authRoutes);
rootRouter.use("/transaction", transactionRoutes);

module.exports = rootRouter;
