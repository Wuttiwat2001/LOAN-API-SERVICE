const express = require("express");
const authRoutes = express.Router();
const { signup } = require("../controllers/auth");

authRoutes.post("/signup", signup);

module.exports = authRoutes;
