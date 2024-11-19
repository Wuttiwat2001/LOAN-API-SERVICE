const express = require("express");
const authRoutes = express.Router();
const { signup,login } = require("../controllers/auth.controller");

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

module.exports = authRoutes;
