const express = require("express");
const userRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { allUsers } = require("../controllers/user.controller");

userRoutes.get("/", [authMiddleware], allUsers);

module.exports = userRoutes;
