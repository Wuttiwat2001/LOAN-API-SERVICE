const express = require("express");
const requestRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { requestBorrow } = require("../controllers/request.controller");

requestRoutes.post("/req", [authMiddleware], requestBorrow);

module.exports = requestRoutes;
