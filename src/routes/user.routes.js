const express = require("express");
const userRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { allUsers, findUserById } = require("../controllers/user.controller");

userRoutes.get("/", [authMiddleware], allUsers);
userRoutes.get("/users/:id", [authMiddleware], findUserById);

module.exports = userRoutes;
