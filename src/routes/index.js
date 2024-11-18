const express = require("express");
const rootRouter = express.Router();
const authRoutes = require("./auth");

rootRouter.use("/auth", authRoutes);

module.exports = rootRouter;
