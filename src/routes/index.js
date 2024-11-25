const express = require("express");
const rootRouter = express.Router();
const authRoutes = require("./auth.routes");
const transactionRoutes = require("./transaction.routes");
const requestRoutes = require("./request.routes");
const userRoutes = require("./user.routes");

rootRouter.use("/auth", authRoutes);
rootRouter.use("/transactions", transactionRoutes);
rootRouter.use("/requests", requestRoutes);
rootRouter.use("/users", userRoutes);

module.exports = rootRouter;
