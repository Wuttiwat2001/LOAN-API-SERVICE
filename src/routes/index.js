const express = require("express");
const rootRouter = express.Router();
const authRoutes = require("./auth.routes");
const transactionRoutes = require("./transaction.routes");
const requestRoutes = require("./request.routes");

rootRouter.use("/auth", authRoutes);
rootRouter.use("/transactions", transactionRoutes);
rootRouter.use("/requests", requestRoutes);

module.exports = rootRouter;
