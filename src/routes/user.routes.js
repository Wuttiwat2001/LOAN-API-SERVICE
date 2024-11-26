const express = require("express");
const userRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { allUsers, balanceById } = require("../controllers/user.controller");
const { validateUserId } = require("../validators/userValidator");
const validationMiddleware = require("../middlewares/validation");

userRoutes.get("/", [authMiddleware], allUsers);
userRoutes.get(
  "/balance/:userId",
  [authMiddleware],
  validateUserId,
  validationMiddleware,
  balanceById
);

module.exports = userRoutes;
