const express = require("express");
const authRoutes = express.Router();
const { signup, login } = require("../controllers/auth.controller");
const { validateLogin } = require("../validators/authValidator");
const validationMiddleware = require("../middlewares/validation");

authRoutes.post("/signup", signup);
authRoutes.post("/login", validateLogin, validationMiddleware, login);

module.exports = authRoutes;
